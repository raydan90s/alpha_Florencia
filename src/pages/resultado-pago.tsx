import { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import { AuthContext } from '../context/AuthContext';
import { useDireccionEnvio } from '../context/DireccionEnvioContext';  // Importa el hook de DireccionEnvioContext

const ResultadoPago = () => {
    const { user } = useContext(AuthContext);  // Accede al contexto de autenticación
    const [searchParams] = useSearchParams();
    const [estadoPago, setEstadoPago] = useState<string>('Verificando...');
    const [esExitoso, setEsExitoso] = useState<boolean | null>(null);
    const [consultaCompletada, setConsultaCompletada] = useState<boolean>(false);
    const [tiempoRestante, setTiempoRestante] = useState<number>(7);
    const navigate = useNavigate();
    const { cartItems, vaciarCarrito, calcularTotal } = useCart();
    const { direccionEnvio } = useDireccionEnvio();  // Accedemos a la dirección de envío desde el contexto

    const usuarioId = user?.id;  // Usa el correo del usuario autenticado o uno temporal

    // Función para consultar el estado del pago
    const consultarPago = async (resourcePath: string) => {
        try {
            if (consultaCompletada) {
                console.log("✅ La consulta ya fue realizada, no se hace nuevamente.");
                return;
            }
            setConsultaCompletada(true);

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/checkout/resultado?id=${resourcePath}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // Verificar si la respuesta es exitosa
            if (!res.ok) {
                console.error('❌ Error al hacer la consulta:', res.statusText);
                setEstadoPago(`Error: ${res.statusText}`);
                setEsExitoso(false);
                return;
            }

            const data = await res.json();
            const code = data.result?.code;
            const description = data.result?.description;

            if (!code || !description) {
                console.error('❌ No se recibió información completa.');
                setEstadoPago('❌ No se recibió la información necesaria del pago.');
                setEsExitoso(false);
                return;
            }

            setEstadoPago(description); 
            setEsExitoso(code.startsWith('000')); 

            await registrarPago(resourcePath, description, code, code.startsWith('000'), usuarioId, cartItems);

            // Si el pago fue exitoso, vaciar el carrito
            if (code.startsWith('000')) {
                vaciarCarrito();
            }

            // Iniciar el conteo regresivo para redirigir
            const intervalId = setInterval(() => {
                setTiempoRestante((prev) => {
                    if (prev === 1) {
                        clearInterval(intervalId); // Detener el contador cuando llegue a 0
                        // Redirigir después de que el pago se haya procesado
                        if (esExitoso !== null) {
                            if (esExitoso) {
                                navigate('/'); // Redirigir a la página principal si el pago fue exitoso
                            } else {
                                navigate('/carrito'); // Redirigir al carrito si el pago no fue exitoso
                            }
                        }
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

    const registrarPago = async (resourcePath: string, estadoPago: string, codigoPago: string, esExitoso: boolean, usuarioId: number, cartItems: any) => {
        const total = calcularTotal().toFixed(2);  // Total con 2 decimales

        const productosCarrito = {
            total: total,  // Total calculado
            productos: cartItems  // El array de productos
        };

        console.log("Productos en el carrito:", productosCarrito);  // Verifica que los datos estén correctamente estructurados

        if (!productosCarrito || !productosCarrito.total || productosCarrito.productos.length === 0) {
            throw new Error("❌ El carrito de productos no contiene los datos necesarios.");
        }

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                resourcePath,
                estadoPago,
                codigoPago,
                esExitoso: esExitoso ? 1 : 0,
                usuarioId,
                productosCarrito,
                direccionEnvio,
            }),
        });

        if (!res.ok) {
            throw new Error('❌ Error al registrar el pago');
        }

        const data = await res.json();
        console.log('✅ Pago registrado en la base de datos:', data);
    };

    useEffect(() => {
        const resourcePath = searchParams.get('resourcePath');
        if (!resourcePath || consultaCompletada) return;

        const timeoutId = setTimeout(() => {
            console.log("CARRITO DESDE USE", cartItems); // Verifica si cartItems tiene los datos esperados
            console.log("Direccion de envio", direccionEnvio);
            if (cartItems.length === 0) {
                console.error("❌ El carrito está vacío.");
                setEstadoPago('❌ El carrito está vacío.');
                setEsExitoso(false);
                return;
            }
            consultarPago(resourcePath);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [searchParams, consultaCompletada, cartItems, direccionEnvio]); // Añadir cartItems como dependencia

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
                            window.location.reload(); // Recargar la página automáticamente
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
