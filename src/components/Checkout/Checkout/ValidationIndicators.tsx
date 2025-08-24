interface ValidationIndicatorsProps {
  isFormValid: boolean;
  isPaymentMethodSelected: boolean;
  areTermsAccepted: boolean;
}

const ValidationIndicators = ({ 
  isFormValid, 
  isPaymentMethodSelected, 
  areTermsAccepted 
}: ValidationIndicatorsProps) => {
  return (
    <div className="space-y-3">
      {/* Validación de formulario */}
      {!isFormValid && (
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
      {isFormValid && !isPaymentMethodSelected && (
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
      {isFormValid && isPaymentMethodSelected && !areTermsAccepted && (
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
  );
};

export default ValidationIndicators;