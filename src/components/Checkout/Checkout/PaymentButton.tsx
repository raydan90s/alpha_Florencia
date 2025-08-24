interface PaymentButtonProps {
  showPaymentWidget: boolean;
  isFormValid: boolean;
  isPaymentMethodSelected: boolean;
  loadingPayment: boolean;
  isAuthenticated: boolean;
  onStartPayment: () => void;
}

const PaymentButton = ({
  showPaymentWidget,
  isFormValid,
  isPaymentMethodSelected,
  loadingPayment,
  isAuthenticated,
  onStartPayment
}: PaymentButtonProps) => {
  
  // Función para verificar términos directamente aquí también
  const checkTermsFromButton = () => {
    const termsCheckbox = document.getElementById('aceptaTerminos') as HTMLInputElement;
    return termsCheckbox?.checked || false;
  };

  if (showPaymentWidget) return null;

  const areTermsAccepted = checkTermsFromButton();
  const isButtonEnabled = isFormValid && isPaymentMethodSelected && areTermsAccepted && !loadingPayment;

  return (
    <button
      type="button"
      onClick={onStartPayment}
      disabled={!isButtonEnabled}
      className={`w-full text-white py-3 px-4 text-sm sm:text-base rounded-md font-medium transition-all duration-200 ${
        isButtonEnabled
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
  );
};

export default PaymentButton;
