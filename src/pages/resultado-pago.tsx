import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ResultadoPago = () => {
    const [searchParams] = useSearchParams();
    const [estadoPago, setEstadoPago] = useState<string>('⏳ Verificando...');
    const [esExitoso, setEsExitoso] = useState<boolean | null>(null);
    const [consultaCompletada, setConsultaCompletada] = useState<boolean>(false); // Nuevo estado para controlar la consulta

    const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

    const consultarPago = async (resourcePath: string) => {
        try {
            // Solo hacer la consulta una vez
            if (consultaCompletada) {
                console.log("✅ La consulta ya fue realizada, no se hace nuevamente.");
                return; // Evitar hacer la consulta de nuevo
            }

            console.log(`🔍 Consultando resultado de pago con resourcePath: ${resourcePath}`);
            setConsultaCompletada(true); // Marcar que la consulta fue hecha

            const res = await fetch(`http://localhost:5000/api/checkout/resultado?id=${resourcePath}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // Verificar si la respuesta es correcta
            if (!res.ok) {
                console.error('❌ Error al hacer la consulta:', res.statusText);
                setEstadoPago(`Error: ${res.statusText}`);
                setEsExitoso(false);
                return;
            }

            const data = await res.json();
            const code = data.result?.code;
            const description = data.result?.description;

            // Verificar si se recibió el código de la transacción
            if (!code || !description) {
                console.error('❌ No se recibió información completa.');
                setEstadoPago('❌ No se recibió la información necesaria del pago.');
                setEsExitoso(false);
                return;
            }

            console.log('✅ Resultado de la consulta:', data);
            setEstadoPago(description); // Mostrar la descripción de la respuesta
            setEsExitoso(code.startsWith('000')); // Si el código empieza con 000, se considera exitoso

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('❌ Error al hacer la consulta:', error.message);
                setEstadoPago(`Error al realizar la consulta: ${error.message}`);
                setEsExitoso(false);
            } else {
                console.error('❌ Error desconocido:', error);
                setEstadoPago('❌ Error desconocido');
                setEsExitoso(false);
            }
        }
    };

    useEffect(() => {
        const resourcePath = searchParams.get('resourcePath');
        if (!resourcePath) {
            setEstadoPago('❌ No se recibió el parámetro de resultado.');
            setEsExitoso(false);
            return;
        }

        console.log("🔍 Recurso recibido:", resourcePath); // Verifica el valor

        consultarPago(resourcePath);
    }, [searchParams]);

    return (
        <div className="max-w-lg mx-auto mt-20 text-center px-4">
            <h1 className="text-2xl font-bold mb-4">Resultado del Pago</h1>
            <p className="text-lg mb-6">{estadoPago}</p>

            {esExitoso !== null && (
                <button
                    onClick={() => window.location.href = '/'}
                    className={`px-6 py-2 rounded text-white transition ${esExitoso ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                    Volver al inicio
                </button>
            )}
        </div>
    );
};

export default ResultadoPago;
