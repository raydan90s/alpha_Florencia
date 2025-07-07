"use client";
import React, { useState, useContext } from "react";
import Shipping from "../components/Checkout/Shipping";
import ShippingMethod from "../components/Checkout/ShippingMethod";
import PaymentMethod from "../components/Checkout/PaymentMethod";
import OrderList from "../components/Checkout/OrderList";
import Billing from "../components/Checkout/Billing";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import { AuthContext } from '../context/AuthContext';


const Checkout = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  const userId = isAuthenticated && user?.id ? user.id : null;

  const [direccionEnvio, setDireccionEnvio] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    cedula: "",
    ciudad: "",
    provincia: "",
    guardarDatos: false,
  });

  const [direccionFacturacion, setDireccionFacturacion] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    cedula: "",
    ciudad: "",
    provincia: "",
  });

  const [usarMismosDatos, setUsarMismosDatos] = useState(true);
  const [notas, setNotas] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isAuthenticated && direccionEnvio.guardarDatos && userId) {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/${userId}/direccion-envio`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(direccionEnvio),
        });
      } catch (error) {
        console.error('Error guardando dirección:', error);
      }
    }
  };

  return (
    <section className="overflow-hidden py-20 bg-gray-2">
      <CheckoutSteps currentStep={1} />
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Izquierda: Formulario */}
            <div className="lg:max-w-[670px] w-full space-y-8">
              <Shipping 
                onChange={setDireccionEnvio} 
                isAuthenticated={isAuthenticated} 
                userId={userId} 
                value={direccionEnvio} 
              />

              {/* Checkbox para usar mismos datos */}
              <div className="bg-white shadow rounded p-6">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={usarMismosDatos}
                    onChange={() => setUsarMismosDatos(!usarMismosDatos)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Usar los mismos datos de envío para facturación
                  </span>
                </label>
              </div>

              {/* Mostrar formulario de facturación solo si el checkbox está desmarcado */}
              {!usarMismosDatos && (
                <Billing onChange={setDireccionFacturacion} />
              )}

              {/* Notas del pedido */}
              <div className="bg-white shadow rounded p-6">
                <label htmlFor="notes" className="block mb-2 font-medium">
                  Notas del pedido (opcional)
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  placeholder="Ej. instrucciones de entrega..."
                  className="w-full p-4 border rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-300"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                />
              </div>
            </div>

            {/* Derecha: Resumen del pedido */}
            <div className="max-w-[455px] w-full space-y-6">
              <OrderList />
              <ShippingMethod />
              <PaymentMethod />
              <div className="text-xs text-gray-600">
                Tus datos personales serán utilizados para procesar tu compra, optimizar tu experiencia en este sitio y administrar el acceso a tu cuenta. Consulta nuestra{" "}
                <a href="/politica-de-privacidad" target="_blank" className="text-blue-600 underline">
                  política de privacidad
                </a>.
              </div>

              <div className="flex items-center mt-4 ">
                <input
                  type="checkbox"
                  required
                  id="aceptaTerminos"
                  className="w-3 h-3 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="aceptaTerminos" className="ml-2 text-gray-700 text-xs">
                  He leído y acepto los{" "}
                  <a
                    href="/terminos-y-condiciones"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    términos y condiciones
                  </a>{" "}
                  del sitio. <span className="text-red mr-1 ">*</span>
                </label>
              </div>

              <button
                type="submit"
                className="mt-6 w-full text-white py-2 px-4 rounded-md text-center inline-block transition-colors bg-[#FF6B00] hover:bg-[#FF8533]"
              >
                Procesar pedido
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
