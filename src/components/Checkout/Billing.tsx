import React, { useState, useEffect } from "react";

interface BillingProps {
  onChange: (direccion: {
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    cedula: string;
    ciudad: string;
    provincia: string;
  }) => void;
}

const Billing: React.FC<BillingProps> = ({ onChange }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    cedula: "",
    ciudad: "",
    provincia: "",
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
      <h4 className="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-200 pb-2">
        Datos de Facturación
      </h4>
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block mb-2.5">Nombres <span className="text-red">*</span></label>
          <input
            type="text"
            name="nombre"
            onChange={handleChange}
            placeholder="Juan"
            className="w-full py-2.5 px-5 border rounded bg-white outline-none"
          />
        </div>
        <div>
          <label className="block mb-2.5">Apellidos <span className="text-red">*</span></label>
          <input
            type="text"
            name="apellido"
            onChange={handleChange}
            placeholder="Pérez"
            className="w-full py-2.5 px-5 border rounded bg-white outline-none"
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">Dirección <span className="text-red">*</span></label>
        <input
          type="text"
          name="direccion"
          onChange={handleChange}
          placeholder="DIRECCION DETALLADA: Av. Siempre Viva 123"
          className="w-full py-2.5 px-5 border rounded bg-white outline-none"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">Número de Teléfono <span className="text-red">*</span></label>
        <input
          type="tel"
          name="telefono"
          onChange={handleChange}
          placeholder="+593 99 999 9999"
          className="w-full py-2.5 px-5 border rounded bg-white outline-none"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">Número de Cédula <span className="text-red">*</span></label>
        <input
          type="text"
          name="cedula"
          onChange={handleChange}
          placeholder="0975123684"
          className="w-full py-2.5 px-5 border rounded bg-white outline-none"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">Ciudad <span className="text-red">*</span></label>
        <input
          type="text"
          name="ciudad"
          onChange={handleChange}
          placeholder="Guayaquil"
          className="w-full py-2.5 px-5 border rounded bg-white outline-none"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2.5">Provincia <span className="text-red">*</span></label>
        <input
          type="text"
          name="provincia"
          onChange={handleChange}
          placeholder="Guayas"
          className="w-full py-2.5 px-5 border rounded bg-white outline-none"
        />
      </div>
    </div>
  );
};

export default Billing;
