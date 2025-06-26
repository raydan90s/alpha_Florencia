"use client";
import React, { useState } from "react";

const SubscriptionForm = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de suscripción
  };

  return (
    <div className="bg-[#003366] p-4 sm:p-6 rounded-lg w-full max-w-md mx-auto">
      <h2 className="text-white text-lg sm:text-xl font-semibold mb-4">
        Suscríbete para más ofertas
      </h2>
      <p className="text-white text-xs sm:text-sm mb-4">
        Reciba ofertas exclusivas por email y nuestro boletín semanal. Vea nuestra
        política de privacidad para más detalles.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="nombre"
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="correo"
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-[#FF6B00] text-white py-2 text-sm sm:text-base rounded-md hover:bg-[#FF8533] transition-colors"
        >
          Buscar
        </button>
      </form>
    </div>
  );
};

export default SubscriptionForm; 