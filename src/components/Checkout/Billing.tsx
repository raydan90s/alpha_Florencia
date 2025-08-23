import React, { useState, useContext, forwardRef, useImperativeHandle, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import type { DireccionEnvio } from "../../types/direccionEnvio";

export type BillingHandle = {
  enviarFacturacion: () => Promise<number | null>;
}

type BillingProps = {
  value: DireccionEnvio;
  onChange: (updatedBilling: DireccionEnvio) => void;
  // Agregar prop para recibir datos de envío actuales
  datosEnvio?: DireccionEnvio;
}

const Billing = forwardRef<BillingHandle, BillingProps>(({ value, onChange, datosEnvio }, ref) => {
  const { user } = useContext(AuthContext);

  // Estado del checkbox "Igual que envío"
  const [igualQueEnvio, setIgualQueEnvio] = useState(true);

  // Inicializar formData desde sessionStorage si existe, sino fallback a value
  const initialFormData: DireccionEnvio = (() => {
    try {
      const stored = sessionStorage.getItem('direccionFacturacion');
      if (stored) return JSON.parse(stored);
    } catch (error) {
      console.error('❌ Error leyendo datos de facturación de sessionStorage:', error);
    }
    return value;
  })();

  const [formData, setFormData] = useState<DireccionEnvio>(initialFormData);

  // Efecto para sincronizar datos cuando cambia igualQueEnvio o datosEnvio
  useEffect(() => {
    if (igualQueEnvio && datosEnvio) {
      // Cuando "igual que envío" está marcado, usar los datos de envío actuales
      const datosFacturacion = { ...datosEnvio };
      setFormData(datosFacturacion);
      onChange(datosFacturacion);
      
      // Guardar en sessionStorage inmediatamente
      sessionStorage.setItem('direccionFacturacion', JSON.stringify(datosFacturacion));
      console.log('✅ Facturación sincronizada con envío:', datosFacturacion);
    } else if (!igualQueEnvio) {
      // Cuando se desmarca, asegurar que onChange tenga los datos actuales del formulario
      onChange(formData);
      sessionStorage.setItem('direccionFacturacion', JSON.stringify(formData));
      console.log('✅ Facturación usando datos específicos:', formData);
    }
  }, [igualQueEnvio, datosEnvio, onChange]);

  // Manejo de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    
    // Solo llamar onChange si NO es "igual que envío"
    if (!igualQueEnvio) {
      onChange(updated);
      // Guardar en sessionStorage inmediatamente
      sessionStorage.setItem('direccionFacturacion', JSON.stringify(updated));
      console.log('✅ Datos de facturación específicos actualizados:', updated);
    }
  };

  // Manejo del checkbox
  const handleCheckboxChange = () => {
    const newIgualQueEnvio = !igualQueEnvio;
    setIgualQueEnvio(newIgualQueEnvio);
    
    if (newIgualQueEnvio && datosEnvio) {
      // Si marca "igual que envío", usar datos de envío
      const datosFacturacion = { ...datosEnvio };
      setFormData(datosFacturacion);
      onChange(datosFacturacion);
      sessionStorage.setItem('direccionFacturacion', JSON.stringify(datosFacturacion));
      console.log('✅ Cambiado a usar datos de envío para facturación:', datosFacturacion);
    } else {
      // Si desmarca, usar los datos específicos del formulario actual
      onChange(formData);
      sessionStorage.setItem('direccionFacturacion', JSON.stringify(formData));
      console.log('✅ Cambiado a usar datos específicos de facturación:', formData);
    }
  };

  // Función para enviar facturación y devolver ID
  const enviarFacturacion = async (): Promise<number | null> => {
    try {
      let dataFacturacion: DireccionEnvio;

      if (igualQueEnvio && datosEnvio) {
        // Usar datos de envío actuales pasados como prop
        dataFacturacion = { ...datosEnvio };
      } else {
        // Usar datos del formulario de facturación
        dataFacturacion = { ...formData };
      }

      // Guardar siempre en sessionStorage
      sessionStorage.setItem('direccionFacturacion', JSON.stringify(dataFacturacion));
      console.log('✅ Facturación guardada en sessionStorage:', dataFacturacion);

      // Llamada al backend
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/facturacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: user?.id,
          nombre: dataFacturacion.nombre,
          apellido: dataFacturacion.apellido,
          direccion: dataFacturacion.direccion,
          identificacion: dataFacturacion.cedula,
          correo: user?.email,
          ciudad: dataFacturacion.ciudad,
          provincia: dataFacturacion.provincia,
        }),
      });

      const data = await res.json();
      if (data.success) return data.facturacionId;
      console.error("❌ Error al registrar facturación:", data.error);
      return null;
    } catch (error) {
      console.error("❌ Error en enviarFacturacion:", error);
      return null;
    }
  };

  // Exponer la función al padre
  useImperativeHandle(ref, () => ({
    enviarFacturacion,
  }));

  return (
    <div className="bg-white shadow rounded p-6">
      <h3 className="font-medium text-black text-xl mb-6">Información de Facturación</h3>

      {/* Checkbox "Igual que envío" */}
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={igualQueEnvio}
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Usar la misma dirección que el envío</span>
        </label>
      </div>

      {/* Mostrar datos cuando está marcado "igual que envío" */}
      {igualQueEnvio && datosEnvio && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Datos de facturación (tomados del envío):</strong>
          </p>
          <div className="text-sm text-gray-700">
            <p><strong>Nombre:</strong> {datosEnvio.nombre} {datosEnvio.apellido}</p>
            <p><strong>Dirección:</strong> {datosEnvio.direccion}</p>
            <p><strong>Ciudad:</strong> {datosEnvio.ciudad}, {datosEnvio.provincia}</p>
            <p><strong>Teléfono:</strong> {datosEnvio.telefono}</p>
            <p><strong>Cédula/RUC:</strong> {datosEnvio.cedula}</p>
          </div>
        </div>
      )}

      {/* Formulario solo si el checkbox está desmarcado */}
      {!igualQueEnvio && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Nombre *</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Ingresa tu nombre" />
          </div>

          {/* Apellido */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Apellido *</label>
            <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Ingresa tu apellido" />
          </div>

          {/* Dirección */}
          <div className="sm:col-span-2">
            <label className="block mb-2 font-medium text-gray-700">Dirección *</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Calle, número, sector, referencias" />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Teléfono *</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="0999123456" />
          </div>

          {/* Cédula/RUC */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Cédula/RUC *</label>
            <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="1234567890" />
          </div>

          {/* Ciudad */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Ciudad *</label>
            <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Ej. Guayaquil" />
          </div>

          {/* Provincia */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Provincia *</label>
            <input type="text" name="provincia" value={formData.provincia} onChange={handleChange} required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Ej. Guayas" />
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>Nota:</strong> Esta información será utilizada únicamente para la facturación de tu pedido.
        </p>
      </div>
    </div>
  );
});

Billing.displayName = "Billing";
export default Billing;