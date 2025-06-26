"use client";
import { FaTruck, FaShieldAlt, FaClock } from 'react-icons/fa';

export default function ShippingInfo() {
  return (
    <div className="mb-6 border-b pb-4 text-gray-700">
      <h3 className="font-bold text-lg mb-3">Envios Inmediatos y Seguros a Todo el Pais</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center">
          <FaTruck className="mr-2 text-blue-500" /> Garantía de Satisfacción
        </li>
        <li className="flex items-center">
          <FaClock className="mr-2 text-orange-500" /> Ordena antes de las 3pm y tu envío saldrá hoy mismo
        </li>
      </ul>
    </div>
  );
}