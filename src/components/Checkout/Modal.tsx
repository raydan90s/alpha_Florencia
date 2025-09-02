import React, { useEffect } from 'react';

// Se define la interfaz para las propiedades del componente
interface PaymentWidgetModalProps {
    show: boolean | null;
    checkoutId: string | null;
    onClose: () => void;
}

// Componente funcional de React
const PaymentWidgetModal: React.FC<PaymentWidgetModalProps> = ({ show, checkoutId, onClose }) => {
    if (!show || !checkoutId) return null;

    useEffect(() => {
        (window as any).wpwlOptions = {
            style: "card", 
            locale: "es", 
            labels: { cvv: "CVV", cardHolder: "Nombre" }, 
            buttonLabels: { pay: "Pagar ahora" }, 

            hideCvv: true,
            onBeforeSubmitCard: function () {
                const cardHolderElement = document.querySelector(".wpwl-control-cardHolder") as HTMLInputElement;

                document.querySelectorAll(".wpwl-has-error").forEach(el => el.classList.remove("wpwl-has-error"));
                document.querySelectorAll(".wpwl-hint-error").forEach(el => el.remove());

                if (cardHolderElement && (!cardHolderElement.value || cardHolderElement.value.trim() === "")) {
                    cardHolderElement.classList.add("wpwl-has-error");
                    cardHolderElement.insertAdjacentHTML("afterend", `<div class='wpwl-hint-error' style='color: red; font-size: 0.8rem; margin-top: 5px;'>Nombre del titular es requerido</div>`);
                    return false;
                }
                return true;
            },

            onReady: function () {
            }
        };

        // Eliminar el script si ya está presente para evitar duplicados
        const existingScript = document.querySelector("script[src*='paymentWidgets.js']");
        if (existingScript) existingScript.remove();

        // Creamos una función para cargar el script después de un pequeño retraso
        const loadScript = () => {
            const script = document.createElement("script");
            script.src = `https://eu-prod.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
            script.async = true;
            document.body.appendChild(script);
        };

        // Llamamos a la función de carga con un retraso
        const timeoutId = setTimeout(loadScript, 500);

        // Función de limpieza para eliminar el script y las opciones al desmontar el componente
        return () => {
            clearTimeout(timeoutId); // Limpiamos el timeout
            const script = document.querySelector("script[src*='paymentWidgets.js']");
            if (script) document.body.removeChild(script);
            delete (window as any).wpwlOptions;
        };
    }, [checkoutId, show]);

    return (
        // Renderizado del modal con el formulario de pago
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded shadow-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-center mb-4">Formulario de Pago</h3>
                <form
                    action="https://tonerexpress-ec.com/resultado-pago"
                    method="GET"
                    className="paymentWidgets"
                    data-brands="VISA MASTER AMEX DINERS"
                />
                <button
                    onClick={onClose}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md w-full"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default PaymentWidgetModal;