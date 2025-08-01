import React, { useState, useContext } from "react";
import { useDireccionEnvio } from '../context/DireccionEnvioContext';
import PaymentWidgetModal from "../components/Checkout/Modal";
import Shipping from "../components/Checkout/Shipping";
import ShippingMethod from "../components/Checkout/ShippingMethod";
import PaymentMethod from "../components/Checkout/PaymentMethod";
import OrderList from "../components/Checkout/OrderList";
import Billing from "../components/Checkout/Billing";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import { AuthContext } from '../context/AuthContext';
import { crearCheckoutReal } from "../utils/checkout";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { cartItems, calcularSubtotal, calcularIVA, calcularTotal } = useCart();
  const { user, isAuthenticated } = useContext(AuthContext);
  const userId = isAuthenticated && user?.id ? user.id : null;

  // Accedemos al contexto de direccionEnvio
  const { setDireccionEnvio } = useDireccionEnvio(); // Usamos el setDireccionEnvio para actualizar el contexto

  const [direccionEnvio, setDireccionEnvioState] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    cedula: "",
    ciudad: "",
    provincia: "",
    pastcode: "",
    guardarDatos: false,
  });

  const [usarMismosDatos, setUsarMismosDatos] = useState(true);
  const [notas, setNotas] = useState("");
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [showPaymentWidget, setShowPaymentWidget] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [errorPayment, setErrorPayment] = useState<string | null>(null);

  const obtenerCheckoutId = async () => {
    await crearCheckoutReal({
      direccionEnvio,
      userId,
      user,
      total: calcularTotal().toFixed(2),
      subtotal: calcularSubtotal().toFixed(2),
      iva: calcularIVA().toFixed(2),
      producto: cartItems,
      setCheckoutId,
      setShowPaymentWidget,
      setLoadingPayment,
      setErrorPayment
    });
  };

  // Aquí actualizamos el contexto de direccionEnvio antes de realizar el submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Imprimir el estado local de direccionEnvio antes de actualizar el contexto
    console.log("Direccion de envio antes de actualizar contexto:", direccionEnvio);

    // Actualizamos el contexto de direccionEnvio
    setDireccionEnvio(direccionEnvio);  // Aquí actualizamos el contexto con los datos de la dirección

    // Verificamos si el contexto se actualizó correctamente
    console.log("Direccion de envio actualizada en el contexto:", direccionEnvio);

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
                onChange={setDireccionEnvioState}  // Para actualizar el estado local de direccionEnvio
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
      <PaymentWidgetModal
        show={showPaymentWidget && checkoutId ? true : false} // Asegúrate de que siempre sea un booleano
        checkoutId={checkoutId} // El checkoutId es necesario para cargar el formulario
        onClose={() => setShowPaymentWidget(false)} // Función para cerrar el modal
      />
    </section>
  );
};

export default Checkout;
