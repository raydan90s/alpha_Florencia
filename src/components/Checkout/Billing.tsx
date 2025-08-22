import React, { useState, useContext, forwardRef, useImperativeHandle } from "react";
import { AuthContext } from "../../context/AuthContext";

interface BillingHandle {
  enviarFacturacion: () => Promise<number | null>;
}

const Billing = forwardRef<BillingHandle>((_props, ref) => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const userEmail = user?.email;

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    cedula: "",
    ciudad: "",
    provincia: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const enviarFacturacion = async (): Promise<number | null> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/usuario/facturacion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: userId,
            nombre: formData.nombre,
            apellido: formData.apellido,
            direccion: formData.direccion,
            identificacion: formData.cedula,
            correo: userEmail,
            ciudad: formData.ciudad,
            provincia: formData.provincia,
            telefono: formData.telefono,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        console.log("✅ Datos de facturación registrados:", data.facturacionId);
        return data.facturacionId;
      } else {
        console.error("❌ Error al registrar facturación:", data.error);
        return null;
      }
    } catch (error) {
      console.error("❌ Error al enviar datos de facturación:", error);
      return null;
    }
  };

  // Exponer la función al padre
  useImperativeHandle(ref, () => ({
    enviarFacturacion,
  }));

  return (
    <div className="bg-white shadow rounded p-6">
      <h3 className="font-medium text-black text-xl mb-6">
        Información de Facturación
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Ingresa tu nombre"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Apellido *
          </label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Ingresa tu apellido"
          />
        </div>
        
        <div className="sm:col-span-2">
          <label className="block mb-2 font-medium text-gray-700">
            Dirección *
          </label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Calle, número, sector, referencias"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Teléfono *
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="0999123456"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Cédula/RUC *
          </label>
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="1234567890"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Ciudad *
          </label>
          <input
            type="text"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Ej. Guayaquil"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Provincia *
          </label>
          <input
            type="text"
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Ej. Guayas"
          />
        </div>
      </div>

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