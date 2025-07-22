// src/components/DatafastPaymentWrapper.tsx
import React, { useEffect, useState } from 'react';

const DatafastPaymentWrapper: React.FC = () => {
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const crearCheckout = async () => {
    try {
      const res = await fetch('https://eu-test.oppwa.com/v1/checkouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer OGE4Mjk0MTg1MzNjZjMxZDAxNTMzZDA2ZmQwNDA3NDh8WHQ3RjIyUUVOWA==',
        },
        body: new URLSearchParams({
          entityId: '8a829418533cf31d0153d306f2ee06fa',
          amount: '92.00',
          currency: 'USD',
          paymentType: 'DB',
        }),
      });

      const data = await res.json();
      console.log('✅ Checkout creado:', data);

      if (data?.id) {
        setCheckoutId(data.id);
      } else {
        setError('No se obtuvo un checkoutId válido.');
        console.error('❌ Respuesta sin checkoutId:', data);
      }
    } catch (err) {
      console.error('❌ Error al crear el checkout:', err);
      setError('Error al conectarse con la API.');
    }
  };

  useEffect(() => {
    crearCheckout();
  }, []);

  // Cargar el script solo cuando ya tienes checkoutId
  useEffect(() => {
    if (!checkoutId) return;

    const script = document.createElement('script');
    script.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [checkoutId]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Pago con Datafast</h2>

      {error && <p className="text-red-500">{error}</p>}
      {!checkoutId && !error && <p>Cargando formulario de pago...</p>}

      {checkoutId && (
        <form
          action="http://localhost:5173/resultado-pago"
          className="paymentWidgets"
          data-brands="VISA MASTER AMEX DINERS"
        ></form>
      )}
    </div>
  );
};

export default DatafastPaymentWrapper;
