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

const Shipping: React.FC<ShippingProps> = ({
  onChange,
  isAuthenticated,
  userId,
  value, // Now explicitly used as the source of truth
}) => {
  const [usarDireccionPrincipal, setUsarDireccionPrincipal] = useState(false);
  const [formAutoCargado, setFormAutoCargado] = useState(false);

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
              // Preserve current notes from the 'value' prop if not provided by fetched data
              notas: (Array.isArray(data) ? data[0]?.notas : data?.notas) ?? value.notas,
            });
            onChange(fetchedDireccion); // Update parent's state directly
            setFormAutoCargado(true);
          } else {
            // If no data, clear form but preserve notes from the current 'value' prop
            onChange(normalizeDireccionEnvio({ ...value, guardarDatos: false }));
            setFormAutoCargado(false);
          }
        } catch (error) {
          console.error("Error cargando dirección guardada:", error);
          // On error, clear form but preserve notes from the current 'value' prop
          onChange(normalizeDireccionEnvio({ ...value, guardarDatos: false }));
          setFormAutoCargado(false);
        }
      } else {
        // If not authenticated or not using principal address, reset to current 'value' prop
        // This ensures the form reflects the parent's state accurately.
        onChange(normalizeDireccionEnvio({ ...value, guardarDatos: false }));
        setFormAutoCargado(false);
      }
    };

    fetchDireccionGuardada();
  }, [isAuthenticated, userId, usarDireccionPrincipal, onChange, value.notas]); // Added onChange and value.notas to dependencies

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue, type, checked } = e.target;

    if (name !== "guardarDatos" && formAutoCargado) {
      setFormAutoCargado(false);
    }

    // Directly call onChange with the updated value
    onChange({
      ...value, // Start with the current value from props
      [name]: type === "checkbox" ? checked : inputValue,
      // 'notas' is managed by the parent, so we don't explicitly set it here.
      // It will be updated by the 'value' prop if the parent sends a new 'value'.
    });
  };

  const handleUsarDireccionPrincipalChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    setUsarDireccionPrincipal(checked);

    if (!checked) {
      // If unchecking, clear form by sending an empty-ish object to parent, preserving notes
      onChange(normalizeDireccionEnvio({ ...value, guardarDatos: false }));
      setFormAutoCargado(false);
    }
    // If checked, the useEffect for fetchDireccionGuardada will handle the update.
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
            value={value.nombre} // Directly use value from props
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
            value={value.apellido} // Directly use value from props
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
          value={value.direccion} // Directly use value from props
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
          value={value.telefono} // Directly use value from props
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
          value={value.cedula} // Directly use value from props
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
          value={value.ciudad} // Directly use value from props
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
          value={value.provincia} // Directly use value from props
          onChange={handleChange}
          placeholder="Guayas"
          className="w-full py-2.5 px-5 border rounded bg-gray-1 outline-none"
          disabled={usarDireccionPrincipal}
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">
          Código Postal <span className="text-red">*</span>
        </label>
        <input
          type="number"
          name="pastcode"
          placeholder="090101"
          className="w-full px-5 py-2.5 border rounded bg-gray-1 outline-none no-spinner"
          value={value.pastcode} // Directly use value from props
          onChange={handleChange}
          disabled={usarDireccionPrincipal}
        />

      </div>

      {/* Mostrar checkbox "Guardar datos" sólo si está autenticado, NO está auto cargado, y NO está usando dirección principal */}
      {isAuthenticated && !formAutoCargado && !usarDireccionPrincipal && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="guardarDatos"
            checked={value.guardarDatos} // Directly use value from props
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
