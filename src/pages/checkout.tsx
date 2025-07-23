import React, { useState, useContext, useEffect } from "react";
import Shipping from "../components/Checkout/Shipping";
import ShippingMethod from "../components/Checkout/ShippingMethod";
import PaymentMethod from "../components/Checkout/PaymentMethod";
import OrderList from "../components/Checkout/OrderList";
import Billing from "../components/Checkout/Billing";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import { AuthContext } from '../context/AuthContext';
import { crearCheckoutPrueba, crearCheckoutReal } from "../utils/checkout";
import { useCart} from "../context/CartContext";

const Checkout = () => {
  const { calcularTotal, cartItems } = useCart();
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

  const [usarMismosDatos, setUsarMismosDatos] = useState(true);
  const [notas, setNotas] = useState("");

  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [showPaymentWidget, setShowPaymentWidget] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [errorPayment, setErrorPayment] = useState<string | null>(null);


  //REEMPLAZAR VALORES REALES 
  const obtenerCheckoutId = async () => {

    //ESTA LINEA ES PARA PRUEBAS NOMAS
    //await crearCheckoutPrueba(setCheckoutId, setShowPaymentWidget, setLoadingPayment, setErrorPayment);

    await crearCheckoutReal({
      direccionEnvio,
      userId,
      user,
      total: calcularTotal().toFixed(2), 
        producto: cartItems,
      setCheckoutId,
      setShowPaymentWidget,
      setLoadingPayment,
      setErrorPayment
    });
  };

  // Montar el script de Datafast solo cuando el modal esté visible y el checkoutId exista
  useEffect(() => {
    if (showPaymentWidget && checkoutId) {
      const existingScript = document.querySelector("script[src*='paymentWidgets.js']");
      if (existingScript) existingScript.remove(); // eliminar scripts viejos si recargas

      const script = document.createElement("script");
      script.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
      script.async = true;
      script.onload = () => console.log("✅ Script cargado");
      document.body.appendChild(script);
    }
  }, [checkoutId, showPaymentWidget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isAuthenticated && direccionEnvio.guardarDatos && userId) {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/${userId}/direccion-envio`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
            <div className="lg:max-w-[670px] w-full space-y-8">
              <Shipping
                onChange={setDireccionEnvio}
                isAuthenticated={isAuthenticated}
                userId={userId}
                value={direccionEnvio}
              />

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

              {!usarMismosDatos && <Billing onChange={() => { }} />}

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

            <div className="max-w-[455px] w-full space-y-6">
              <OrderList />
              <ShippingMethod />
              <PaymentMethod />

              <div className="text-xs text-gray-600">
                Tus datos personales serán utilizados para procesar tu compra, optimizar tu experiencia en este sitio y administrar el acceso a tu cuenta. Consulta nuestra{" "}
                <a href="/politica-privacidad" target="_blank" className="text-blue-600 underline">
                  política de privacidad
                </a>.
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  required
                  id="aceptaTerminos"
                  className="w-3 h-3 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="aceptaTerminos" className="ml-2 text-gray-700 text-xs">
                  He leído y acepto los{" "}
                  <a href="/terminos-condiciones" target="_blank" className="text-blue-600 underline">
                    términos y condiciones
                  </a>{" "}
                  del sitio. <span className="text-red mr-1">*</span>
                </label>
              </div>

              {!showPaymentWidget && (
                <button
                  type="button"
                  onClick={obtenerCheckoutId}
                  disabled={loadingPayment}
                  className="w-full bg-[#FF6B00] text-white py-2 text-sm sm:text-base rounded-md hover:bg-[#FF8533] transition-colors"
                >
                  {loadingPayment ? "Cargando formulario..." : "Pagar ahora"}
                </button>
              )}

              {errorPayment && <p className="text-red-500 mt-2">{errorPayment}</p>}
            </div>
          </div>
        </form>
      </div>

      {/* MODAL con widget */}
      {showPaymentWidget && checkoutId && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowPaymentWidget(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* IMPORTANTE: el form debe existir cuando se monte el script */}
            <form
              action="http://localhost:5173/resultado-pago"
              className="paymentWidgets"
              data-brands="VISA MASTER AMEX DINERS DISCOVER"
            ></form>

            <button
              onClick={() => setShowPaymentWidget(false)}
              className="mt-4 btn btn-secondary w-full"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Checkout;
