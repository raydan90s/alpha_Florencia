import React, { useEffect } from 'react';

interface PaymentWidgetModalProps {
    show: boolean | null;
    checkoutId: string | null;
    onClose: () => void;
}

const PaymentWidgetModal: React.FC<PaymentWidgetModalProps> = ({ show, checkoutId, onClose }) => {
    if (!show || !checkoutId) return null;

    useEffect(() => {
        // Definir la configuración de Datafast (wpwlOptions) en el objeto global window
        (window as any).wpwlOptions = {
            style: "card",
            locale: "es",
            labels: { cvv: "CVV", cardHolder: "Nombre" },
            onBeforeSubmitCard: function () {
                // Definir los selectores de los campos para la validación
                const fields = [
                    { selector: ".wpwl-control-cardHolder", message: "Nombre del titular es requerido" },
                    { selector: ".wpwl-control-cardNumber", message: "Número de tarjeta es requerido" },
                    { selector: ".wpwl-control-expiry", message: "Fecha de vencimiento es requerida" },
                    { selector: ".wpwl-control-cvv", message: "CVV es requerido" }
                ];

                // Limpiar errores previos
                document.querySelectorAll(".wpwl-has-error").forEach(el => el.classList.remove("wpwl-has-error"));
                document.querySelectorAll(".wpwl-hint-error").forEach(el => el.remove());

                const payButton = document.querySelector(".wpwl-button-pay");
                payButton?.classList.remove("wpwl-button-error");
                payButton?.removeAttribute("disabled");

                let isValid = true;

                // Iterar sobre los campos y validar si están vacíos
                fields.forEach(field => {
                    const element = document.querySelector(field.selector) as HTMLInputElement;
                    if (element && (!element.value || element.value.trim() === "")) {
                        element.classList.add("wpwl-has-error");
                        element.insertAdjacentHTML("afterend", `<div class='wpwl-hint-error' style='color: red; font-size: 0.8rem; margin-top: 5px;'>${field.message}</div>`);
                        isValid = false;
                    }
                });

                if (!isValid) {
                    payButton?.classList.add("wpwl-button-error");
                    (payButton as HTMLButtonElement)?.setAttribute("disabled", "disabled");
                }

                return isValid;
            }
        };

        // Eliminar el script si ya está presente para evitar duplicados
        const existingScript = document.querySelector("script[src*='paymentWidgets.js']");
        if (existingScript) existingScript.remove();

        // Crear el nuevo script con el checkoutId
        const script = document.createElement("script");
        script.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
        script.async = true;

        // Añadir el script al final del body
        document.body.appendChild(script);

        // Limpiar el script y la configuración de wpwlOptions cuando el componente se desmonte
        return () => {
            document.body.removeChild(script);
            delete (window as any).wpwlOptions;
        };
    }, [checkoutId, show]);
    return (
        // ... (El resto del componente sigue siendo el mismo)
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
                    action="http://localhost:5173/resultado-pago"
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