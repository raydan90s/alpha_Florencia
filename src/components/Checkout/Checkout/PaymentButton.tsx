  // components/Checkout/PaymentButton.tsx
  import React from 'react';

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

    // Debug cada vez que cambian las props
    React.useEffect(() => {
      const areTermsAccepted = checkTermsFromButton();
      const isButtonEnabled = isFormValid && isPaymentMethodSelected && areTermsAccepted && !loadingPayment;
      
      console.log('🔘 === ESTADO DEL BOTÓN DE PAGO ===');
      console.log('📋 Formulario válido:', isFormValid ? '✅' : '❌');
      console.log('💳 Método de pago seleccionado:', isPaymentMethodSelected ? '✅' : '❌');
      console.log('📄 Términos aceptados:', areTermsAccepted ? '✅' : '❌');
      console.log('⏳ Cargando:', loadingPayment ? '🔄 SÍ' : '❌ NO');
      console.log('👤 Autenticado:', isAuthenticated ? '✅' : '❌');
      console.log('🔘 BOTÓN HABILITADO:', isButtonEnabled ? '✅ SÍ' : '❌ NO');
      console.log('=====================================');
    }, [isFormValid, isPaymentMethodSelected, loadingPayment, isAuthenticated]);

    if (showPaymentWidget) return null;

    const areTermsAccepted = checkTermsFromButton();
    const isButtonEnabled = isFormValid && isPaymentMethodSelected && areTermsAccepted && !loadingPayment;

    return (
      <div>
        {/* Panel de debug visual siempre visible para testing */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
          <div className="font-bold text-blue-800 mb-2">🔍 Estado del Botón de Pago:</div>
          <div className={`flex items-center gap-2 ${isFormValid ? 'text-green-600' : 'text-red-600'}`}>
            <span>{isFormValid ? '✅' : '❌'}</span>
            <span>Formulario válido</span>
          </div>
          <div className={`flex items-center gap-2 ${isPaymentMethodSelected ? 'text-green-600' : 'text-red-600'}`}>
            <span>{isPaymentMethodSelected ? '✅' : '❌'}</span>
            <span>Método de pago seleccionado</span>
          </div>
          <div className={`flex items-center gap-2 ${areTermsAccepted ? 'text-green-600' : 'text-red-600'}`}>
            <span>{areTermsAccepted ? '✅' : '❌'}</span>
            <span>Términos aceptados</span>
          </div>
          <div className={`flex items-center gap-2 ${!loadingPayment ? 'text-green-600' : 'text-orange-600'}`}>
            <span>{!loadingPayment ? '✅' : '⏳'}</span>
            <span>No está cargando</span>
          </div>
          <div className="mt-2 pt-2 border-t border-blue-200">
            <div className={`font-bold ${isButtonEnabled ? 'text-green-600' : 'text-red-600'}`}>
              🔘 Botón: {isButtonEnabled ? 'HABILITADO ✅' : 'DESHABILITADO ❌'}
            </div>
          </div>
        </div>
        
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
      </div>
    );
  };

  export default PaymentButton;