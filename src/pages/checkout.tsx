import { useState, useContext, useCallback } from "react";
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
import type { DireccionEnvio } from "../types/direccionEnvio";

const Checkout = () => {
  const { cartItems, calcularSubtotal, calcularIVA, calcularTotal } = useCart();
  const { user, isAuthenticated } = useContext(AuthContext);
  const userId = isAuthenticated && user?.id ? user.id : null;

  const [direccionEnvio, setDireccionEnvioState] = useState<DireccionEnvio>({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    cedula: "",
    ciudad: "",
    provincia: "",
    pastcode: "",
    guardarDatos: false,
    notas: "", // Notas agregadas al objeto
  });

  const [usarMismosDatos, setUsarMismosDatos] = useState(true);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [showPaymentWidget, setShowPaymentWidget] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [errorPayment, setErrorPayment] = useState<string | null>(null);

  // Function to handle changes in direccionEnvio, including 'notas'
  const handleChangeDireccion = useCallback((updatedDireccion: DireccionEnvio) => {
    setDireccionEnvioState((prevState) => {
      // Evita la actualización si no hay cambios
      if (JSON.stringify(prevState) !== JSON.stringify(updatedDireccion)) {
        return {
          ...prevState,
          ...updatedDireccion,
          notas: updatedDireccion.notas !== undefined ? updatedDireccion.notas : prevState.notas,
        };
      }
      return prevState;  // No actualiza el estado si no hubo cambios
    });
  }, []);

  // Handle changes specifically for the 'notas' field
  const handleNotasChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotas = e.target.value;
    setDireccionEnvioState((prevState) => {
      // Solo actualiza si las notas cambian
      if (prevState.notas !== newNotas) {
        return { ...prevState, notas: newNotas };
      }
      return prevState;
    });
  }, []);

  const handleStartPayment = async () => {
    setLoadingPayment(true);
    setErrorPayment(null);

    try {
      sessionStorage.setItem('direccionEnvio', JSON.stringify(direccionEnvio));
      console.log("✅ Dirección de envío guardada en sessionStorage.");
    } catch (e) {
      console.error("❌ Error al guardar en sessionStorage:", e);
    }

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
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:max-w-[670px] w-full space-y-8">
              <Shipping
                onChange={handleChangeDireccion}
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
                  name="notas"
                  rows={4}
                  placeholder="Ej. instrucciones de entrega..."
                  className="w-full p-4 border rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-300"
                  value={direccionEnvio.notas}
                  onChange={handleNotasChange} // Use the new handler for notes
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
