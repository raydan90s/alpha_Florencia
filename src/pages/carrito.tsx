"use client";

import { Link } from "react-router-dom"; // si usas react-router, o simplemente <a> para enlaces
import { useCart } from "../context/CartContext"; // Importa el hook useCart
import { useConfiguracion } from "../context/SettingContext"; // Importa el hook useConfiguracion

export default function Carrito() {
  const { cartItems, actualizarCantidad, eliminarItem, calcularSubtotal, calcularIVA } = useCart();
  const { configuracion, loading } = useConfiguracion();

  if (loading || !configuracion) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando configuración...
      </div>
    );
  }

  const { iva: porcentajeIva } = configuracion;
  // Estos cálculos utilizan los métodos del CartContext para mantener la consistencia
  const subtotal = calcularSubtotal();
  const iva = calcularIVA();
  const total = subtotal + iva;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-8">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">Tu carrito está vacío</p>
                <Link
                  to="/productos"
                  className="mt-4 inline-block text-[#003366] hover:text-[#004488]"
                >
                  Ver productos
                </Link>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-24 h-24 relative">
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {item.nombre}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                ${item.precio.toFixed(2)}
                              </p>
                            </div>
                            <button
                              // Llama a la función `eliminarItem` del contexto
                              onClick={() => eliminarItem(item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="mt-4 flex items-center">
                            <button
                              // Llama a la función `actualizarCantidad` del contexto para decrementar
                              onClick={() =>
                                actualizarCantidad(item.id, item.cantidad - 1)
                              }
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="mx-4 text-gray-900">{item.cantidad}</span>
                            <button
                              // Llama a la función `actualizarCantidad` del contexto para incrementar
                              onClick={() =>
                                actualizarCantidad(item.id, item.cantidad + 1)
                              }
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Resumen de compra */}
          <div className="lg:col-span-4">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Resumen de compra
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">IVA ({(porcentajeIva).toFixed(0)}%)</span>
                  <span className="text-gray-900">${iva.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-lg font-medium text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
                {cartItems.length > 0 ? (
                  <Link
                    to="/checkout"
                    className="mt-6 w-full text-white py-2 px-4 rounded-md text-center inline-block transition-colors bg-[#FF6B00] hover:bg-[#FF8533]"
                  >
                    Proceder al pago
                  </Link>
                ) : (
                  <button
                    disabled
                    className="mt-6 w-full bg-[#e5e7eb] text-[#6b7280] py-2 px-4 rounded-md cursor-not-allowed"
                  >
                    Proceder al pago
                  </button>
                )}


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
