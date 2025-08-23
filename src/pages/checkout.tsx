// pages/Checkout.tsx
import { useState, useContext, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PaymentWidgetModal from "../components/Checkout/Modal";
import Shipping from "../components/Checkout/Shipping";
import ShippingMethod from "../components/Checkout/ShippingMethod";
import PaymentMethod from "../components/Checkout/PaymentMethod";
import OrderList from "../components/Checkout/OrderList";
import Billing from "../components/Checkout/Billing";
import type { BillingHandle } from "../components/Checkout/Billing";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import CustomAlert from "../components/Checkout/Checkout/CustomAlert";
import ValidationIndicators from "../components/Checkout/Checkout/ValidationIndicators";
import AuthenticationNotice from "../components/Checkout/Checkout/AuthenticationNotice";
import PrivacyPolicyNotice from "../components/Checkout/Checkout/PrivacyPolicyNotice";
import TermsConditionsCheckbox from "../components/Checkout/Checkout/TermsConditionsCheckbox";
import PaymentButton from "../components/Checkout/Checkout/PaymentButton";
import DatafastCertification from "../components/Checkout/Checkout/DatafastCertification";
import PaymentErrorDisplay from "../components/Checkout/Checkout/PaymentErrorDisplay";
import OrderNotes from "../components/Checkout/Checkout/OrderNotes";
import { AuthContext } from '../context/AuthContext';
import { crearCheckoutReal } from "../utils/checkout";
import { useCart } from "../context/CartContext";
import type { DireccionEnvio } from "../types/direccionEnvio";

const Checkout = () => {
  const { cartItems, calcularSubtotalEnvio, calcularIVAEnvio, calcularTotalEnvio } = useCart();
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = isAuthenticated && user?.id ? user.id : null;
  
  // Ref para acceder a las funciones del componente Billing
  const billingRef = useRef<BillingHandle>(null);

  // Estado para dirección de envío
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

  // Estado para datos de facturación (separado del envío)
  const [billingData, setBillingData] = useState<DireccionEnvio>({
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

  // Removido: const [usarMismosDatos, setUsarMismosDatos] = useState(true);
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

  // Estado para términos y condiciones
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  // Función para actualizar dirección de envío
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

  // Estado para forzar re-evaluación de validación
  const [validationTrigger, setValidationTrigger] = useState(0);

  // Función para actualizar datos de facturación (separada)
  const handleChangeBilling = useCallback((updatedBilling: DireccionEnvio) => {
    setBillingData(prev => ({
      ...prev,
      ...updatedBilling,
      notas: updatedBilling.notas !== undefined ? updatedBilling.notas : prev.notas
    }));
    // Forzar re-evaluación de validación
    setValidationTrigger(prev => prev + 1);
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

  // Efecto para configurar las opciones de Datafast cuando se muestre el widget de pago
  useEffect(() => {
    if (showPaymentWidget && checkoutId) {
      (window as any).wpwlOptions = {
        onReady: function () {
          const datafast = '<br/><br/><img src="https://www.datafast.com.ec/images/verified.png" style="display:block;margin:0 auto; width:100%;">';
          if ((window as any).$ && (window as any).$('form.wpwl-form-card').length > 0) {
            (window as any).$('form.wpwl-form-card').find('.wpwl-button').before(datafast);
          }
        },
        style: "card",
        locale: "es",
        labels: {
          cvv: "CVV",
          cardHolder: "Nombre(Igual que en la tarjeta)"
        }
      };
    }
  }, [showPaymentWidget, checkoutId]);

  // Efecto para restaurar datos guardados cuando el usuario regresa después de registrarse
  useEffect(() => {
    const savedCheckoutData = sessionStorage.getItem('checkoutFormData');
    if (savedCheckoutData) {
      try {
        const parsedData = JSON.parse(savedCheckoutData);
        const dataAge = Date.now() - (parsedData.timestamp || 0);
        const oneHour = 60 * 60 * 1000;

        if (dataAge < oneHour) {
          setDireccionEnvioState(parsedData.direccionEnvio || direccionEnvio);
          setBillingData(parsedData.billingData || billingData);

          setAlertMessage("¡Bienvenido! Hemos restaurado los datos que habías ingresado anteriormente.");
          setAlertConfig({
            showCancelButton: false,
            onCancel: undefined,
            onConfirm: undefined
          });
          setShowAlert(true);
        }

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
      billingData,
      timestamp: Date.now()
    };

    try {
      sessionStorage.setItem('checkoutFormData', JSON.stringify(checkoutData));
    } catch (error) {
      console.error("❌ Error al guardar datos del checkout:", error);
    }
  }, [direccionEnvio, billingData]);

  // Función de validación del formulario (simplificada)
  const isFormValid = useCallback(() => {
    // Campos obligatorios para envío (pastcode sí es requerido)
    const shippingRequiredFields: Array<keyof DireccionEnvio> = [
      "nombre",
      "apellido",
      "direccion",
      "telefono",
      "cedula",
      "ciudad",
      "provincia",
      "pastcode", // obligatorio en envío
    ];

    const shippingValid = shippingRequiredFields.every(field => {
      const value = direccionEnvio[field];
      return value !== "" && value !== null && value !== undefined;
    });

    // Para la facturación, verificamos si los datos de sessionStorage están listos
    // o si tenemos datos básicos en billingData
    let billingValid = false;
    
    try {
      const storedBilling = sessionStorage.getItem('direccionFacturacion');
      if (storedBilling) {
        const billingFromStorage = JSON.parse(storedBilling);
        billingValid = billingFromStorage.nombre !== "" && 
                      billingFromStorage.apellido !== "" &&
                      billingFromStorage.cedula !== "";
      } else {
        // Fallback a billingData si no hay nada en storage
        billingValid = billingData.nombre !== "" && 
                      billingData.apellido !== "" &&
                      billingData.cedula !== "";
      }
    } catch (error) {
      // Si hay error leyendo storage, usar billingData
      billingValid = billingData.nombre !== "" && 
                    billingData.apellido !== "" &&
                    billingData.cedula !== "";
    }

    return shippingValid && billingValid;
  }, [direccionEnvio, billingData, validationTrigger]);

  // Función para verificar si los términos están aceptados (usando estado)
  const areTermsAccepted = useCallback(() => {
    return termsAccepted;
  }, [termsAccepted]);

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
      // Guardar dirección de envío en sessionStorage
      sessionStorage.setItem('direccionEnvio', JSON.stringify(direccionEnvio));

      // El componente Billing ya se encarga de guardar sus datos en sessionStorage
      // Llamar a la función de enviarFacturacion para asegurar que los datos estén guardados
      if (billingRef.current) {
        await billingRef.current.enviarFacturacion();
      }

      await crearCheckoutReal({
        direccionEnvio,
        userId,
        user,
        total: calcularTotalEnvio().toFixed(2),
        subtotal: calcularSubtotalEnvio().toFixed(2),
        iva: calcularIVAEnvio().toFixed(2),
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

    if (alertConfig.onConfirm) {
      alertConfig.onConfirm();
    }

    setAlertConfig({
      showCancelButton: false,
      onCancel: undefined,
      onConfirm: undefined
    });
  };

  // Función para cancelar alerta
  const handleCancelAlert = () => {
    setShowAlert(false);

    if (alertConfig.onCancel) {
      alertConfig.onCancel();
    }

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
              <Billing
                ref={billingRef}
                value={billingData}
                onChange={handleChangeBilling}
                datosEnvio={direccionEnvio}
              />

              <OrderNotes
                notas={direccionEnvio.notas}
                handleNotasChange={handleNotasChange}
              />
            </div>

            {/* Columna derecha - Resumen y pago */}
            <div className="max-w-[455px] w-full space-y-6">
              <OrderList />
              <ShippingMethod />
              <PaymentMethod
                selectedMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
              />

              <ValidationIndicators
                isFormValid={isFormValid()}
                isPaymentMethodSelected={isPaymentMethodSelected()}
                areTermsAccepted={areTermsAccepted()}
              />

              <AuthenticationNotice isAuthenticated={isAuthenticated} />

              <PrivacyPolicyNotice />

              <TermsConditionsCheckbox 
                termsAccepted={termsAccepted}
                onTermsChange={setTermsAccepted}
              />

              <PaymentButton
                showPaymentWidget={showPaymentWidget}
                isFormValid={isFormValid()}
                isPaymentMethodSelected={isPaymentMethodSelected()}
                loadingPayment={loadingPayment}
                isAuthenticated={isAuthenticated}
                onStartPayment={handleStartPayment}
              />

              <DatafastCertification />

              <PaymentErrorDisplay errorPayment={errorPayment} />
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