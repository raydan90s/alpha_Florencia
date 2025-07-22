// src/components/DatafastPayment.tsx
import { useEffect } from 'react';

interface Props {
    checkoutId: string;
}

const DatafastPayment = ({ checkoutId }: Props) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
        script.async = true;
        document.body.appendChild(script);
        console.log('Codigo recibido en datafast', checkoutId);
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
