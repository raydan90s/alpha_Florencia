import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ResultadoPago = () => {
  const [searchParams] = useSearchParams();
  const [estadoPago, setEstadoPago] = useState<string>('⏳ Verificando...');
  const [esExitoso, setEsExitoso] = useState<boolean | null>(null);

  useEffect(() => {
    const resourcePath = searchParams.get('resourcePath');

    if (!resourcePath) {
      setEstadoPago('❌ No se recibió el parámetro de resultado.');
      setEsExitoso(false);
      return;
    }

    fetch(`http://localhost:5000/api/checkout/resultado?resourcePath=${encodeURIComponent(resourcePath)}`)
      .then((res) => res.json())
      .then((data) => {
        const code = data.result?.code;
        const description = data.result?.description || 'Sin descripción';

        if (code?.startsWith('000.')) {
          setEstadoPago('✅ ¡Pago aprobado exitosamente! Gracias por tu compra.');
          setEsExitoso(true);

          // Si deseas guardar la orden:
          // fetch('http://localhost:5000/api/pedidos', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ checkoutId: data.id, ...otrosDatos }),
          // });
        } else if (code?.startsWith('800.')) {
          setEstadoPago(`❌ Transacción rechazada. Motivo: ${description}`);
          setEsExitoso(false);
        } else {
          setEstadoPago(`⚠️ Estado desconocido: ${description} (Código: ${code})`);
          setEsExitoso(false);
        }
      })
      .catch((error) => {
        console.error('Error verificando pago:', error);
        setEstadoPago('❌ Error al verificar el estado del pago.');
        setEsExitoso(false);
      });
  }, [searchParams]);

  return (
    <div className="max-w-lg mx-auto mt-20 text-center px-4">
      <h1 className="text-2xl font-bold mb-4">Resultado del Pago</h1>
      <p className="text-lg mb-6">{estadoPago}</p>

      {esExitoso !== null && (
        <button
          onClick={() => window.location.href = '/'}
          className={`px-6 py-2 rounded text-white transition ${
            esExitoso ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Volver al inicio
        </button>
      )}
    </div>
  );
};

export default ResultadoPago;
