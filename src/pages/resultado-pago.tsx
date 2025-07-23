import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ResultadoPago = () => {
  const [searchParams] = useSearchParams();
  const [estadoPago, setEstadoPago] = useState<string>('⏳ Verificando...');

  useEffect(() => {
    const resourcePath = searchParams.get('resourcePath');

    if (!resourcePath) {
      setEstadoPago('❌ No se recibió el parámetro de resultado.');
      return;
    }

    fetch(`http://localhost:5000/api/checkout/resultado?resourcePath=${encodeURIComponent(resourcePath)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result?.code?.startsWith('000.')) {
          setEstadoPago('✅ Pago aprobado con éxito');
        } else if (data.result?.description) {
          setEstadoPago(`❌ ${data.result.description}`);
        } else {
          setEstadoPago(`⚠️ No se pudo determinar el estado del pago (${data.result?.code || 'sin código'})`);
        }
      })
      .catch((error) => {
        console.error('Error verificando pago:', error);
        setEstadoPago('❌ Error al verificar el estado del pago');
      });
  }, [searchParams]);

  return (
    <div className="max-w-lg mx-auto mt-20 text-center px-4">
      <h1 className="text-2xl font-bold mb-4">Resultado del Pago</h1>
      <p className="text-lg">{estadoPago}</p>
    </div>
  );
};

export default ResultadoPago;
