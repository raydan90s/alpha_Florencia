// components/Checkout/PaymentErrorDisplay.tsx
import React from 'react';

interface PaymentErrorDisplayProps {
  errorPayment: string | null;
}

const PaymentErrorDisplay = ({ errorPayment }: PaymentErrorDisplayProps) => {
  if (!errorPayment) return null;

  return (
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
  );
};

export default PaymentErrorDisplay;