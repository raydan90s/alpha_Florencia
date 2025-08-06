import { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import { AuthContext } from '../context/AuthContext';

const ResultadoPago = () => {
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const [estadoPago, setEstadoPago] = useState<string>('Verificando...');
    const [esExitoso, setEsExitoso] = useState<boolean | null>(null);
    const [consultaCompletada, setConsultaCompletada] = useState<boolean>(false);
    const [tiempoRestante, setTiempoRestante] = useState<number>(7);
    const navigate = useNavigate();
    const { cartItems, vaciarCarrito, calcularTotal } = useCart();
    const usuarioId = user?.id;
    const [direccionEnvioLocal] = useState<any | null>(() => {
        try {
            const storedDireccion = sessionStorage.getItem('direccionEnvio');
            if (storedDireccion) {
                console.log('✅ Dirección de envío recuperada y parseada de sessionStorage.');
                return JSON.parse(storedDireccion);
            }
        } catch (e) {
            console.error("❌ Error al parsear la dirección de sessionStorage:", e);
        }
        return null;
    });

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

            if (!res.ok) {
                console.error('❌ Error al hacer la consulta:', res.statusText);
                setEstadoPago(`Error: ${res.statusText}`);
                setEsExitoso(false);
                return;
            }

            const data = await res.json();
            const code = data.result?.code;
            const description = data.result?.description;
            const id_pago = data.id;

            console.log("ID DE PAGO MANDADO", id_pago);

            if (!code || !description) {
                console.error('❌ No se recibió información completa.');
                setEstadoPago('❌ No se recibió la información necesaria del pago.');
                setEsExitoso(false);
                return;
            }

            setEstadoPago(description);
            setEsExitoso(code.startsWith('000'));


            if (code.startsWith('000')) {
                await registrarPago(resourcePath, description, code, code.startsWith('000'), usuarioId, cartItems, direccionEnvioLocal, id_pago);
                vaciarCarrito();
            }

            // Una vez que el pago se ha procesado y registrado,
            // es seguro limpiar sessionStorage para evitar datos antiguos.
            sessionStorage.removeItem('direccionEnvio');

            const intervalId = setInterval(() => {
                setTiempoRestante((prev) => {
                    if (prev === 1) {
                        clearInterval(intervalId);
                        if (esExitoso !== null) {
                            if (esExitoso) {
                                navigate('/');
                            } else {
                                navigate('/carrito');
                            }
                        }
                    }
                    return prev - 1;
                });
            }, 1000);

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

    const registrarPago = async (resourcePath: string, estadoPago: string, codigoPago: string, esExitoso: boolean, usuarioId: number, cartItems: any, direccionEnvio: any, id_pago: string) => {
        const total = calcularTotal().toFixed(2);
        console.log("TOTAL ENVIADO  A LA BASE DE DATOS", total);

        const productosCarrito = {
            total: total,
            productos: cartItems
        };


        if (!productosCarrito || !productosCarrito.total || productosCarrito.productos.length === 0) {
            throw new Error("❌ El carrito de productos no contiene los datos necesarios.");
        }

        // Verifica que la dirección de envío no sea nula antes de enviarla
        if (!direccionEnvio) {
            throw new Error("❌ No se pudo recuperar la dirección de envío.");
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
                id_pago 
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

        // El efecto ahora solo se ejecuta si resourcePath está disponible
        // y la dirección de envío ya ha sido cargada en el estado inicial.
        if (!resourcePath || !direccionEnvioLocal || consultaCompletada) {
            console.log('Esperando por el resourcePath o la dirección de envío local...');
            return;
        }


        const timeoutId = setTimeout(() => {
            if (cartItems.length === 0) {
                console.error("❌ El carrito está vacío.");
                setEstadoPago('❌ El carrito está vacío.');
                setEsExitoso(false);
                return;
            }
            consultarPago(resourcePath);
        }, 2000);

        return () => clearTimeout(timeoutId);

    }, [searchParams, consultaCompletada, cartItems, navigate, direccionEnvioLocal]);


    return (
        <div className="max-w-lg mx-auto mt-20 text-center px-4 mb-20">
            <h1 className="text-2xl font-bold mb-4">Resultado del Pago</h1>
            <p className="text-lg mb-6">{estadoPago}</p>

            {esExitoso !== null && (
                <div className="text-xl font-semibold mb-12">
                    Redirigiendo en {tiempoRestante} segundos...
                </div>
            )}

            {esExitoso !== null && (
                <button
                    onClick={() => {
                        if (esExitoso) {
                            navigate('/');
                        } else {
                            navigate('/carrito');
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