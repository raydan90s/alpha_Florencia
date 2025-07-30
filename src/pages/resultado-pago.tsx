import { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ResultadoPago = () => {
    const [searchParams] = useSearchParams();
    const [estadoPago, setEstadoPago] = useState<string>('Verificando...');
    const [esExitoso, setEsExitoso] = useState<boolean | null>(null);
    const [consultaCompletada, setConsultaCompletada] = useState<boolean>(false);
    const [tiempoRestante, setTiempoRestante] = useState<number>(7);
    const navigate = useNavigate(); // Usamos el hook de React Router para redirigir
    const { user } = useContext(AuthContext);
    // Función para vaciar el carrito
    const vaciarCarrito = async (id_usuario: string) => {
        if (!id_usuario) {
            console.error("❌ id_usuario no está definido");
            return;
        }
        try {
            const res = await fetch('http://localhost:5000/api/carrito/vaciar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_usuario }), // Asegúrate de que se esté enviando correctamente
            });

            if (!res.ok) {
                console.error('❌ Error al vaciar el carrito:', res.statusText);
            } else {
                console.log('✅ Carrito vaciado con éxito');
            }
        } catch (error) {
            console.error('❌ Error al vaciar el carrito:', error);
        }
    };

    const consultarPago = async (resourcePath: string) => {
        try {
            if (consultaCompletada) {
                console.log("✅ La consulta ya fue realizada, no se hace nuevamente.");
                return;
            }

            console.log(`🔍 Consultando resultado de pago con resourcePath: ${resourcePath}`);
            setConsultaCompletada(true);

            const res = await fetch(`http://localhost:5000/api/checkout/resultado?id=${resourcePath}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

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

            if (code.startsWith('000')) {
                const id_usuario = user?.id;
                if (id_usuario) {
                    await vaciarCarrito(id_usuario); // Solo vaciar el carrito si el pago fue exitoso
                }
            }

            // Iniciar el conteo regresivo
            const intervalId = setInterval(() => {
                setTiempoRestante((prev) => {
                    if (prev === 1) {
                        clearInterval(intervalId); // Detener el contador cuando llegue a 0
                        navigate('/'); // Redirigir a la página principal
                    }
                    return prev - 1;
                });
            }, 1000); // Actualizar cada segundo

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

        // Evitar hacer la consulta si ya se hizo
        if (!resourcePath || consultaCompletada) {
            return; // No ejecutar la consulta si ya se hizo
        }

        console.log("🔍 Recurso recibido:", resourcePath); // Verifica el valor

        // Establecer un timeout de 2 segundos antes de hacer la consulta
        const timeoutId = setTimeout(() => {
            consultarPago(resourcePath);
        }, 2000); // Retraso de 2 segundos antes de ejecutar la consulta

        // Limpiar el timeout cuando el componente se desmonte o se cambien los parámetros
        return () => clearTimeout(timeoutId);
    }, [searchParams, consultaCompletada]);

    return (
        <div className="max-w-lg mx-auto mt-20 text-center px-4 mb-20">
            <h1 className="text-2xl font-bold mb-4">Resultado del Pago</h1>
            <p className="text-lg mb-6">{estadoPago}</p>

            {/* Mostrar el tiempo restante */}
            {esExitoso !== null && (
                <div className="text-xl font-semibold mb-12">
                    Redirigiendo en {tiempoRestante} segundos...
                </div>
            )}

            {esExitoso !== null && (
                <button
                    onClick={() => {
                        if (esExitoso) {
                            navigate('/'); // Redirige si el pago fue exitoso
                        } else {
                            navigate('/carrito'); // Redirige al carrito si el pago no fue exitoso
                        }
                    }}
                    className={`px-6 py-2 rounded text-white transition ${esExitoso ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                    {esExitoso ? 'Volver al inicio' : 'Volver al carrito'}
                </button>
            )}
        </div>
    );
};

export default ResultadoPago;
