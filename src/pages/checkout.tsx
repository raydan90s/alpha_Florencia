import { useState, useContext, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Asegúrate de tener react-router-dom instalado
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
  showCancelButton?: boolean;
  onCancel?: () => void;
}

const CustomAlert = ({ message, onClose, showCancelButton = false, onCancel }: CustomAlertProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
      <h3 className="font-bold text-lg text-red-600 mb-2">¡Atención!</h3>
      <p className="py-4">{message}</p>
      <div className="modal-action flex gap-2">
        {showCancelButton && onCancel && (
          <button 
            onClick={onCancel} 
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button 
          onClick={onClose} 
          className={`${showCancelButton ? 'flex-1' : 'w-full'} bg-[#FF6B00] text-white py-2 rounded-md hover:bg-[#FF8533] transition-colors`}
        >
          {showCancelButton ? 'Continuar' : 'Entendido'}
        </button>
      </div>
    </div>
  </div>
);

const Checkout = () => {
  const { cartItems, calcularSubtotal, calcularIVA, calcularTotal } = useCart();
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
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
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    showCancelButton: false,
    onCancel: undefined as (() => void) | undefined,
    onConfirm: undefined as (() => void) | undefined
  });

  // Estado para el método de pago seleccionado
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  // Efecto para restaurar datos guardados cuando el usuario regresa después de registrarse
  useEffect(() => {
    const savedCheckoutData = sessionStorage.getItem('checkoutFormData');
    if (savedCheckoutData) {
      try {
        const parsedData = JSON.parse(savedCheckoutData);
        // Verificar que los datos no sean muy antiguos (más de 1 hora)
        const dataAge = Date.now() - (parsedData.timestamp || 0);
        const oneHour = 60 * 60 * 1000;
        
        if (dataAge < oneHour) {
          setDireccionEnvioState(parsedData.direccionEnvio || direccionEnvio);
          setUsarMismosDatos(parsedData.usarMismosDatos !== undefined ? parsedData.usarMismosDatos : true);
          
          // Mostrar mensaje de confirmación de que se restauraron los datos
          setAlertMessage("¡Bienvenido! Hemos restaurado los datos que habías ingresado anteriormente.");
          setAlertConfig({
            showCancelButton: false,
            onCancel: undefined,
            onConfirm: undefined
          });
          setShowAlert(true);
        }
        
        // Limpiar los datos guardados después de verificar
        sessionStorage.removeItem('checkoutFormData');
      } catch (error) {
        console.error("Error al restaurar datos del checkout:", error);
        sessionStorage.removeItem('checkoutFormData');
      }
    }
  }, []);

  // Función para guardar los datos actuales del formulario
  const saveCheckoutDataToSession = useCallback(() => {
    const checkoutData = {
      direccionEnvio,
      usarMismosDatos,
      timestamp: Date.now() // Para verificar que no sean datos muy antiguos
    };
    
    try {
      sessionStorage.setItem('checkoutFormData', JSON.stringify(checkoutData));
    } catch (error) {
      console.error("❌ Error al guardar datos del checkout:", error);
    }
  }, [direccionEnvio, usarMismosDatos]);

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

  // Función de validación del formulario
  const isFormValid = useCallback(() => {
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

    return requiredFields.every(field => {
      const value = direccionEnvio[field];
      return value !== "" && value !== null && value !== undefined;
    });
  }, [direccionEnvio]);

  // Función para verificar si los términos están aceptados
  const areTermsAccepted = useCallback(() => {
    const termsCheckbox = document.getElementById('aceptaTerminos') as HTMLInputElement;
    return termsCheckbox?.checked || false;
  }, []);

  // Función para verificar si se ha seleccionado un método de pago
  const isPaymentMethodSelected = useCallback(() => {
    return selectedPaymentMethod !== "" && selectedPaymentMethod !== null;
  }, [selectedPaymentMethod]);

  // Función principal para manejar el inicio del pago
  const handleStartPayment = async () => {
    // 1. Validación de formulario
    if (!isFormValid()) {
      setAlertMessage("Por favor, completa todos los campos obligatorios antes de continuar.");
      setAlertConfig({
        showCancelButton: false,
        onCancel: undefined,
        onConfirm: undefined
      });
      setShowAlert(true);
      return;
    }

    // 2. Validación de método de pago
    if (!isPaymentMethodSelected()) {
      setAlertMessage("Por favor, selecciona un método de pago para continuar.");
      setAlertConfig({
        showCancelButton: false,
        onCancel: undefined,
        onConfirm: undefined
      });
      setShowAlert(true);
      return;
    }

    // 3. Validación de términos y condiciones
    if (!areTermsAccepted()) {
      setAlertMessage("Debes aceptar los términos y condiciones para continuar con la compra.");
      setAlertConfig({
        showCancelButton: false,
        onCancel: undefined,
        onConfirm: undefined
      });
      setShowAlert(true);
      return;
    }

    // 4. Verificación de autenticación
    if (!isAuthenticated) {
      const handleRedirectToRegister = () => {
        saveCheckoutDataToSession();
        sessionStorage.setItem('redirectAfterAuth', '/checkout');
        navigate('/registrarse');
      };

      const handleCancelRedirect = () => {
        setShowAlert(false);
      };

      // Mostrar alerta de confirmación para redirigir al registro
      setAlertMessage("Para completar tu compra necesitas tener una cuenta. ¿Te gustaría registrarte ahora? Tus datos se guardarán automáticamente.");
      setAlertConfig({
        showCancelButton: true,
        onCancel: handleCancelRedirect,
        onConfirm: handleRedirectToRegister
      });
      setShowAlert(true);
      return;
    }

    // 5. Proceder con el pago si el usuario está autenticado
    await proceedWithPayment();
  };

  // Función separada para procesar el pago
  const proceedWithPayment = async () => {
    setLoadingPayment(true);
    setErrorPayment(null);

    try {
      sessionStorage.setItem('direccionEnvio', JSON.stringify(direccionEnvio));
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

      // Guardar dirección del usuario si está habilitado
      if (isAuthenticated && direccionEnvio.guardarDatos && userId) {
        try {
           await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/${userId}/direccion-envio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(direccionEnvio),
          });
        } catch (error) {
          console.error('❌ Error guardando dirección en perfil:', error);
        }
      }

    } catch (error) {
      console.error('❌ Error en el proceso de pago:', error);
      setErrorPayment('Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.');
      setLoadingPayment(false);
    }
  };

  // Función para cerrar alertas
  const handleCloseAlert = () => {
    setShowAlert(false);
    
    // Ejecutar acción de confirmación si existe
    if (alertConfig.onConfirm) {
      alertConfig.onConfirm();
    }
    
    // Resetear configuración de alerta
    setAlertConfig({
      showCancelButton: false,
      onCancel: undefined,
      onConfirm: undefined
    });
  };

  // Función para cancelar alerta
  const handleCancelAlert = () => {
    setShowAlert(false);
    
    // Ejecutar acción de cancelación si existe
    if (alertConfig.onCancel) {
      alertConfig.onCancel();
    }
    
    // Resetear configuración de alerta
    setAlertConfig({
      showCancelButton: false,
      onCancel: undefined,
      onConfirm: undefined
    });
  };

  return (
    <section className="overflow-hidden py-20 bg-gray-2">
      <CheckoutSteps currentStep={1} />
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Columna izquierda - Formularios */}
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
                  placeholder="Ej. instrucciones de entrega, referencias, etc..."
                  className="w-full p-4 border rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-300"
                  value={direccionEnvio.notas}
                  onChange={handleNotasChange}
                />
              </div>
            </div>

            {/* Columna derecha - Resumen y pago */}
            <div className="max-w-[455px] w-full space-y-6">
              <OrderList />
              <ShippingMethod />
              <PaymentMethod 
                selectedMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
              />

              {/* Indicador de validaciones faltantes */}
              <div className="space-y-3">
                {/* Validación de formulario */}
                {!isFormValid() && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 text-red-600">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-red-700 text-sm font-medium">Completa todos los campos obligatorios</span>
                    </div>
                  </div>
                )}

                {/* Validación de método de pago */}
                {isFormValid() && !isPaymentMethodSelected() && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 text-yellow-600">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <span className="text-yellow-700 text-sm font-medium">Selecciona un método de pago</span>
                    </div>
                  </div>
                )}

                {/* Validación de términos */}
                {isFormValid() && isPaymentMethodSelected() && !areTermsAccepted() && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 text-blue-600">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-blue-700 text-sm font-medium">Acepta los términos y condiciones</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Indicador de autenticación */}
              {!isAuthenticated && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 text-yellow-600 mt-0.5">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">
                        Registro requerido
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Necesitarás registrar una cuenta para completar tu compra. Tus datos se guardarán automáticamente.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Política de privacidad */}
              <div className="text-xs text-gray-600">
                Tus datos personales serán utilizados para procesar tu compra, optimizar tu experiencia en este sitio y administrar el acceso a tu cuenta. Consulta nuestra{" "}
                <a href="/politica-privacidad" target="_blank" className="text-blue-600 underline">
                  política de privacidad
                </a>.
              </div>

              {/* Términos y condiciones */}
              <div className="flex items-start mt-4 gap-3">
                <input
                  type="checkbox"
                  required
                  id="aceptaTerminos"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1 shrink-0"
                />
                <label htmlFor="aceptaTerminos" className="text-gray-700 text-xs leading-relaxed">
                  He leído y acepto los{" "}
                  <a href="/terminos-condiciones" target="_blank" className="text-blue-600 underline">
                    términos y condiciones
                  </a>{" "}
                  del sitio web. <span className="text-red-500 mr-1">*</span>
                </label>
              </div>

              {/* Botón de pago */}
              {!showPaymentWidget && (
                <button
                  type="button"
                  onClick={handleStartPayment}
                  disabled={loadingPayment || !isFormValid() || !isPaymentMethodSelected()}
                  className={`w-full text-white py-3 px-4 text-sm sm:text-base rounded-md font-medium transition-all duration-200 ${
                    isFormValid() && isPaymentMethodSelected() && !loadingPayment
                      ? "bg-[#FF6B00] hover:bg-[#FF8533] hover:shadow-lg transform hover:-translate-y-0.5"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {loadingPayment ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando...
                    </div>
                  ) : (
                    <>
                      {isAuthenticated ? "Proceder al pago" : "Registrarse y pagar"}
                    </>
                  )}
                </button>
              )}

              {/* Error de pago */}
              {errorPayment && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 text-red-600 mt-0.5">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-800 mb-1">Error en el pago</h4>
                      <p className="text-sm text-red-700">{errorPayment}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Modal del widget de pago */}
      <PaymentWidgetModal
        show={showPaymentWidget && checkoutId ? true : false}
        checkoutId={checkoutId}
        onClose={() => setShowPaymentWidget(false)}
      />

      {/* Alerta personalizada */}
      {showAlert && (
        <CustomAlert 
          message={alertMessage} 
          onClose={handleCloseAlert}
          showCancelButton={alertConfig.showCancelButton}
          onCancel={alertConfig.onCancel ? handleCancelAlert : undefined}
        />
      )}
    </section>
  );
};

export default Checkout;