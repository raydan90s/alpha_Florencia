import { useEffect } from 'react';

const DatafastPayment = ({ checkoutId }: { checkoutId: string }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [checkoutId]);

    return (
        <form
            action="http://localhost:5173/resultado-pago"
            method="GET"
            className="paymentWidgets"
            data-brands="VISA MASTER AMEX DINERS"
        />

    );
};

export default DatafastPayment;
