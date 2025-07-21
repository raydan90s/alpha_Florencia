import React, { useState, useEffect } from "react";

interface ShippingProps {
  onChange: (direccion: DireccionEnvio) => void;
  isAuthenticated: boolean;
  userId: number | null;
  value?: DireccionEnvio; // Lo hacemos opcional, no lo forzamos
}

interface DireccionEnvio {
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  cedula: string;
  ciudad: string;
  provincia: string;
  guardarDatos: boolean;
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
    guardarDatos: data.guardarDatos ?? false,
  };
}

const Shipping: React.FC<ShippingProps> = ({
  onChange,
  isAuthenticated,
  userId,
}) => {
  const [usarDireccionPrincipal, setUsarDireccionPrincipal] = useState(false);

  const [formData, setFormData] = useState<DireccionEnvio>({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    cedula: "",
    ciudad: "",
    provincia: "",
    guardarDatos: false,
  });

  // Controla si el formulario fue autocompletado con datos guardados
  const [formAutoCargado, setFormAutoCargado] = useState(false);

  // Cuando cambia formData, notificamos a la función padre
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  useEffect(() => {
    const fetchDireccionGuardada = async () => {
      if (isAuthenticated && userId && usarDireccionPrincipal) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/usuarios/${userId}/direccion-envio/principal`
          );
          const data = await res.json();


          if (data) {
            if (Array.isArray(data) && data.length > 0) {
              setFormData(
                normalizeDireccionEnvio({
                  ...data[0],
                  guardarDatos: false,
                })
              );
              setFormAutoCargado(true);
            } else if (!Array.isArray(data)) {
              setFormData(
                normalizeDireccionEnvio({
                  ...data,
                  guardarDatos: false,
                })
              );
              setFormAutoCargado(true);
            } else {
              setFormAutoCargado(false);
              setFormData(normalizeDireccionEnvio({ guardarDatos: false }));
            }
          } else {
            setFormAutoCargado(false);
            setFormData(normalizeDireccionEnvio({ guardarDatos: false }));
          }
        } catch (error) {
          console.error("Error cargando dirección guardada:", error);
          setFormAutoCargado(false);
        }
      } else {
        setFormAutoCargado(false);
        setFormData(normalizeDireccionEnvio({ guardarDatos: false }));
      }
    };

    fetchDireccionGuardada();
  }, [isAuthenticated, userId, usarDireccionPrincipal]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name !== "guardarDatos" && formAutoCargado) {
      setFormAutoCargado(false);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUsarDireccionPrincipalChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    setUsarDireccionPrincipal(checked);

    if (!checked) {
      // Si desactiva la opción, limpiar formulario y permitir guardar datos
      setFormData(normalizeDireccionEnvio({ guardarDatos: false }));
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
            Nombres <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Juan"
            className="w-full py-2.5 px-5 border rounded bg-gray-1 outline-none"
            disabled={usarDireccionPrincipal}
          />
        </div>
        <div>
          <label className="block mb-2.5">
            Apellidos <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Pérez"
            className="w-full py-2.5 px-5 border rounded bg-gray-1 outline-none"
            disabled={usarDireccionPrincipal}
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">
          Dirección <span className="text-red">*</span>
        </label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Av. Siempre Viva 123"
          className="w-full py-2.5 px-5 border rounded bg-gray-1 outline-none"
          disabled={usarDireccionPrincipal}
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">
          Número de Teléfono <span className="text-red">*</span>
        </label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="+593 99 999 9999"
          className="w-full py-2.5 px-5 border rounded bg-gray-1 outline-none"
          disabled={usarDireccionPrincipal}
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">
          Número de Cédula <span className="text-red">*</span>
        </label>
        <input
          type="text"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          placeholder="0975123684"
          className="w-full py-2.5 px-5 border rounded bg-gray-1 outline-none"
          disabled={usarDireccionPrincipal}
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">
          Ciudad <span className="text-red">*</span>
        </label>
        <input
          type="text"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          placeholder="Guayaquil"
          className="w-full py-2.5 px-5 border rounded bg-gray-1 outline-none"
          disabled={usarDireccionPrincipal}
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">
          Provincia <span className="text-red">*</span>
        </label>
        <input
          type="text"
          name="provincia"
          value={formData.provincia}
          onChange={handleChange}
          placeholder="Guayas"
          className="w-full py-2.5 px-5 border rounded bg-gray-1 outline-none"
          disabled={usarDireccionPrincipal}
        />
      </div>

      {/* Mostrar checkbox "Guardar datos" sólo si está autenticado, NO está auto cargado, y NO está usando dirección principal */}
      {isAuthenticated && !formAutoCargado && !usarDireccionPrincipal && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="guardarDatos"
            checked={formData.guardarDatos}
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
