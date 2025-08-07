import React, { useState, useEffect } from "react";
import type { DireccionEnvio } from "../../types/direccionEnvio";

interface ShippingProps {
  onChange: (direccion: DireccionEnvio) => void;
  isAuthenticated: boolean;
  userId: number | null;
  value: DireccionEnvio; // This prop is the single source of truth for form data
}

function normalizeDireccionEnvio(data: Partial<DireccionEnvio>): DireccionEnvio {
  return {
    nombre: data.nombre ?? "",
    apellido: data.apellido ?? "",
    direccion: data.direccion ?? "",
    telefono: data.telefono ?? "",
    cedula: data.cedula ?? "",
    ciudad: data.ciudad ?? "",
    provincia: data.provincia ?? "",
    pastcode: data.pastcode ?? "",
    guardarDatos: data.guardarDatos ?? false,
    notas: data.notas ?? '',
  };
}

// Helper function for validation
const validateField = (name: string, value: string): string => {
  switch (name) {

    case "nombre":
      if (value.trim().length < 3) {
        return "Ingrese un nombre válido.";
      }
      return "";
    case "apellido":
      if (value.trim().length < 3) {
        return "Ingrese un apellido válido.";
      }
      return "";
    case "direccion":
      if (value.trim().length < 5) {
        return "Ingrese dirección válida";
      }
      return "";
    case "telefono":
      const telefonoRegex = /^\d{10}$/;
      if (!telefonoRegex.test(value)) {
        return "Ingrese un télefono válido.";
      }
      return "";
    case "cedula":
      const cedulaRegex = /^\d{10}$/;
      if (!cedulaRegex.test(value)) {
        return "Ingrese un documento válido";
      }
      return "";
    case "pastcode":
      const pastcodeRegex = /^\d{1,6}$/;
      if (!pastcodeRegex.test(value) || value.length > 6) {
        return "Ingrese un código válido";
      }
      return "";
    case "ciudad":
    case "provincia":
      if (value.trim().length < 3) {
        return "Ingrese una direccion válida.";
      }
      return "";
    default:
      return "";
  }
};

const Shipping: React.FC<ShippingProps> = ({
  onChange,
  isAuthenticated,
  userId,
  value,
}) => {
  const [usarDireccionPrincipal, setUsarDireccionPrincipal] = useState(false);
  const [formAutoCargado, setFormAutoCargado] = useState(false);
  const [errors, setErrors] = useState<Record<keyof Omit<DireccionEnvio, 'guardarDatos' | 'notas'>, string>>({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    cedula: "",
    ciudad: "",
    provincia: "",
    pastcode: "",
  });

  useEffect(() => {
    const fetchDireccionGuardada = async () => {
      if (isAuthenticated && userId && usarDireccionPrincipal) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/usuarios/${userId}/direccion-envio/principal`
          );
          const data = await res.json();

          if (data) {
            const fetchedDireccion = normalizeDireccionEnvio({
              ...(Array.isArray(data) ? data[0] : data),
              guardarDatos: false,
              notas: (Array.isArray(data) ? data[0]?.notas : data?.notas) ?? value.notas,
            });
            onChange(fetchedDireccion);
            setFormAutoCargado(true);
          } else {
            onChange(normalizeDireccionEnvio({ ...value, guardarDatos: false }));
            setFormAutoCargado(false);
          }
        } catch (error) {
          console.error("Error cargando dirección guardada:", error);
          onChange(normalizeDireccionEnvio({ ...value, guardarDatos: false }));
          setFormAutoCargado(false);
        }
      } else {
        onChange(normalizeDireccionEnvio({ ...value, guardarDatos: false }));
        setFormAutoCargado(false);
      }
    };

    fetchDireccionGuardada();
  }, [isAuthenticated, userId, usarDireccionPrincipal, onChange, value.notas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue, type, checked } = e.target;

    if (name !== "guardarDatos" && formAutoCargado) {
      setFormAutoCargado(false);
    }

    onChange({
      ...value,
      [name]: type === "checkbox" ? checked : inputValue,
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;
    const errorMessage = validateField(name, inputValue);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleUsarDireccionPrincipalChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    setUsarDireccionPrincipal(checked);

    if (!checked) {
      // Clear errors when unchecking the box
      setErrors({
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        cedula: "",
        ciudad: "",
        provincia: "",
        pastcode: "",
      });
      onChange(normalizeDireccionEnvio({ ...value, guardarDatos: false }));
      setFormAutoCargado(false);
    }
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
      <h4 className="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-200 pb-2">
        Datos de envío
      </h4>

      {isAuthenticated && (
        <div className="mb-5 flex items-center gap-2">
          <input
            type="checkbox"
            id="usarDireccionPrincipal"
            checked={usarDireccionPrincipal}
            onChange={handleUsarDireccionPrincipalChange}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="usarDireccionPrincipal" className="text-sm text-slate-700">
            Usar dirección guardada principal
          </label>
        </div>
      )}

      <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block mb-2.5">
            Nombres <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            value={value.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Juan"
            className={`w-full py-2.5 px-5 border rounded bg-gray-1 outline-none ${errors.nombre ? 'border-red-500' : ''
              }`}
            disabled={usarDireccionPrincipal}
          />
          {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
        </div>
        <div>
          <label className="block mb-2.5">
            Apellidos <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="apellido"
            value={value.apellido}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Pérez"
            className={`w-full py-2.5 px-5 border rounded bg-gray-1 outline-none ${errors.apellido ? 'border-red-500' : ''
              }`}
            disabled={usarDireccionPrincipal}
          />
          {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
        </div>
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">
          Dirección <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="direccion"
          value={value.direccion}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Av. Siempre Viva 123"
          className={`w-full py-2.5 px-5 border rounded bg-gray-1 outline-none ${errors.direccion ? 'border-red-500' : ''
            }`}
          disabled={usarDireccionPrincipal}
        />
        {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">
          Número de Teléfono <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="telefono"
          value={value.telefono}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0999999999"
          className={`w-full py-2.5 px-5 border rounded bg-gray-1 outline-none ${errors.telefono ? 'border-red-500' : ''
            }`}
          disabled={usarDireccionPrincipal}
        />
        {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">
          Número de Cédula <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="cedula"
          value={value.cedula}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0975123684"
          className={`w-full py-2.5 px-5 border rounded bg-gray-1 outline-none ${errors.cedula ? 'border-red-500' : ''
            }`}
          disabled={usarDireccionPrincipal}
        />
        {errors.cedula && <p className="text-red-500 text-sm mt-1">{errors.cedula}</p>}
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">
          Ciudad <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="ciudad"
          value={value.ciudad}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Guayaquil"
          className={`w-full py-2.5 px-5 border rounded bg-gray-1 outline-none ${errors.ciudad ? 'border-red-500' : ''
            }`}
          disabled={usarDireccionPrincipal}
        />
        {errors.ciudad && <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>}
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">
          Provincia <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="provincia"
          value={value.provincia}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Guayas"
          className={`w-full py-2.5 px-5 border rounded bg-gray-1 outline-none ${errors.provincia ? 'border-red-500' : ''
            }`}
          disabled={usarDireccionPrincipal}
        />
        {errors.provincia && <p className="text-red-500 text-sm mt-1">{errors.provincia}</p>}
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">
          Código Postal <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="pastcode"
          placeholder="090101"
          className={`w-full px-5 py-2.5 border rounded bg-gray-1 outline-none no-spinner ${errors.pastcode ? 'border-red-500' : ''
            }`}
          value={value.pastcode}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={usarDireccionPrincipal}
        />
        {errors.pastcode && <p className="text-red-500 text-sm mt-1">{errors.pastcode}</p>}
      </div>

      {isAuthenticated && !formAutoCargado && !usarDireccionPrincipal && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="guardarDatos"
            checked={value.guardarDatos}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded"
          />
          <label className="text-sm text-slate-700">
            Guardar datos para próximos envíos
          </label>
        </div>
      )}
    </div>
  );
};

export default Shipping;