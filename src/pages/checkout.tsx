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

interface CustomAlertProps {
  message: string;
  onClose: () => void;
}

const CustomAlert = ({ message, onClose }: CustomAlertProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
      <h3 className="font-bold text-lg text-red-600 mb-2">¡Atención!</h3>
      <p className="py-4">{message}</p>
      <div className="modal-action">
        <button onClick={onClose} className="w-full bg-[#FF6B00] text-white py-2 rounded-md hover:bg-[#FF8533] transition-colors">
          Entendido
        </button>
      </div>
    </div>
  </div>
);

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
    notas: "",
  });

  const [usarMismosDatos, setUsarMismosDatos] = useState(true);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [showPaymentWidget, setShowPaymentWidget] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [errorPayment, setErrorPayment] = useState<string | null>(null);
  // Nuevo estado para la alerta personalizada
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChangeDireccion = useCallback((updatedDireccion: DireccionEnvio) => {
    setDireccionEnvioState((prevState) => {
      if (JSON.stringify(prevState) !== JSON.stringify(updatedDireccion)) {
        return {
          ...prevState,
          ...updatedDireccion,
          notas: updatedDireccion.notas !== undefined ? updatedDireccion.notas : prevState.notas,
        };
      }
      return prevState;
    });
  }, []);

  const handleNotasChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotas = e.target.value;
    setDireccionEnvioState((prevState) => {
      if (prevState.notas !== newNotas) {
        return { ...prevState, notas: newNotas };
      }
      return prevState;
    });
  }, []);
  
  // NUEVA FUNCIÓN DE VALIDACIÓN
  const isFormValid = useCallback(() => {
    // Si la facturación es diferente, también necesitas validar esos campos.
    // Por ahora, solo validamos los campos de envío.
    const requiredFields: Array<keyof DireccionEnvio> = [
      "nombre",
      "apellido",
      "direccion",
      "telefono",
      "cedula",
      "ciudad",
      "provincia",
      "pastcode",
    ];

    return requiredFields.every(field => direccionEnvio[field] !== "");
  }, [direccionEnvio]);

  const handleStartPayment = async () => {
    // Validación previa antes de iniciar el pago
    if (!isFormValid()) {
      setAlertMessage("Por favor, completa todos los campos obligatorios antes de continuar.");
      setShowAlert(true);
      return; // Detiene la ejecución
    }

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
                  onChange={handleNotasChange}
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
                  // El botón se deshabilita si está cargando o si el formulario no es válido
                  disabled={loadingPayment || !isFormValid()}
                  className={`w-full text-white py-2 text-sm sm:text-base rounded-md transition-colors ${
                    isFormValid() && !loadingPayment
                      ? "bg-[#FF6B00] hover:bg-[#FF8533]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
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

      {/* Alerta personalizada para campos vacíos */}
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </section>
  );
};

export default Checkout;
