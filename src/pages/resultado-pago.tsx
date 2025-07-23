import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ResultadoPago = () => {
    const [searchParams] = useSearchParams();
    const [estadoPago, setEstadoPago] = useState<string>('⏳ Verificando...');

    useEffect(() => {
        const resourcePath = searchParams.get('resourcePath');
        console.log("ResourcePath", resourcePath);

        if (!resourcePath) {
            setEstadoPago('❌ Falta el parámetro resourcePath');
            return;
        }

        console.log("Consultando resourcePath:", resourcePath);

        fetch(`http://localhost:8809/api/checkout/resultado?resourcePath=${encodeURIComponent(resourcePath)}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                console.log("📦 Respuesta:", data);
                if (data.result?.code?.startsWith('000.')) {
                    setEstadoPago('✅ Pago aprobado con éxito');
                } else if (data.result?.description) {
                    setEstadoPago(`❌ ${data.result.description}`);
                } else {
                    setEstadoPago(`⚠️ No se pudo determinar el estado del pago (${data.result?.code})`);
                }
            })
            .catch((err) => {
                console.error("Error al consultar:", err);
                setEstadoPago('❌ Error al verificar el pago');
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
