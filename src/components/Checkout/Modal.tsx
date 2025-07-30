// src/components/Modal/PaymentWidgetModal.js
import React, { useEffect } from 'react';

interface PaymentWidgetModalProps {
  show: boolean | null; 
  checkoutId: string | null;  
  onClose: () => void;
}

const PaymentWidgetModal: React.FC<PaymentWidgetModalProps> = ({ show, checkoutId, onClose }) => {
  if (!show || !checkoutId) return null;


    useEffect(() => {
        const existingScript = document.querySelector("script[src*='paymentWidgets.js']");
        if (existingScript) existingScript.remove();

        const script = document.createElement("script");
        script.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
        script.async = true;
        script.onload = () => {
            console.log("Formulario de pago cargado con CheckoutId:", checkoutId);
        };

        document.body.appendChild(script);
    }, [checkoutId, show]);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded shadow-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()} 
            >
                <form
                    action="http://localhost:5173/resultado-pago"
                    method="GET"
                    className="paymentWidgets"
                    data-brands="VISA MASTER AMEX DINERS"
                />
                <button
                    onClick={onClose}
                    className="mt-4 btn btn-secondary w-full"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default PaymentWidgetModal;
