import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ResultadoPago = () => {
  const [searchParams] = useSearchParams();
  const [estadoPago, setEstadoPago] = useState<string>('Verificando...');

  useEffect(() => {
    const resourcePath = searchParams.get('resourcePath');

    if (!resourcePath) {
      setEstadoPago('❌ Falta el parámetro resourcePath');
      return;
    }

    // Extraemos checkoutId de resourcePath
    const match = resourcePath.match(/checkouts\/(.+)\/payment/);
    const checkoutId = match ? match[1] : null;

    if (!checkoutId) {
      setEstadoPago('❌ No se pudo extraer checkoutId de resourcePath');
      return;
    }

    console.log("Consultando checkoutId:", checkoutId);

    fetch(`http://localhost:5000/api/checkout/resultado?resourcePath=${encodeURIComponent(resourcePath)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result?.code?.startsWith('000.')) {
          setEstadoPago('✅ Pago aprobado');
        } else if (data.result?.description) {
          setEstadoPago(`❌ ${data.result.description}`);
        } else {
          setEstadoPago('⚠️ Estado desconocido');
        }
      })
      .catch((err) => {
        console.error(err);
        setEstadoPago('❌ Error al verificar el pago');
      });
  }, [searchParams]);

  return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Resultado del Pago</h1>
      <p className="text-lg">{estadoPago}</p>
    </div>
  );
};

export default ResultadoPago;
