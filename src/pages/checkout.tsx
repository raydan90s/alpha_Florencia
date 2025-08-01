import React, { useState, useContext, useEffect } from "react";
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
  const { setDireccionEnvio } = useDireccionEnvio();

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

  /**
   * Esta función es ahora la responsable de iniciar todo el proceso de pago.
   * Se guarda la dirección en sessionStorage para que persista a través de la recarga de página.
   */
  const handleStartPayment = async () => {
    setLoadingPayment(true);
    setErrorPayment(null);

    // PASO CLAVE: Guardamos la dirección de envío en sessionStorage antes de la redirección.
    try {
        sessionStorage.setItem('direccionEnvio', JSON.stringify(direccionEnvio));
        console.log("✅ Dirección de envío guardada en sessionStorage.");
    } catch (e) {
        console.error("❌ Error al guardar en sessionStorage:", e);
    }
    
    // También actualizamos el contexto por si se necesita antes de la redirección.
    setDireccionEnvio(direccionEnvio);
    console.log("✅ Contexto de dirección de envío actualizado con éxito.");


    // Llamar a la función que crea la sesión de checkout
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

    // Si el usuario quiere guardar sus datos, lo hacemos aquí.
    if (isAuthenticated && direccionEnvio.guardarDatos && userId) {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/${userId}/direccion-envio`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(direccionEnvio),
        });
        console.log("✅ Dirección de envío guardada en la base de datos.");
      } catch (error) {
        console.error('❌ Error guardando dirección:', error);
      }
    }
  };


  return (
    <section className="overflow-hidden py-20 bg-gray-2">
      <CheckoutSteps currentStep={1} />
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Usamos e.preventDefault() para evitar el envío por defecto del formulario. */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:max-w-[670px] w-full space-y-8">
              <Shipping
                onChange={setDireccionEnvioState}
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
                  onClick={handleStartPayment}
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
        show={showPaymentWidget && checkoutId ? true : false}
        checkoutId={checkoutId}
        onClose={() => setShowPaymentWidget(false)}
      />
    </section>
  );
};

export default Checkout;