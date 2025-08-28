import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';  // Importa el contexto de carrito
import { AuthContext } from './AuthContext'; // Importa el contexto de autenticación

// Define la interfaz de tipo PaymentContext
interface PaymentContextType {
    procesarPago: (resourcePath: string) => Promise<void>;
    estadoPago: string;
    esExitoso: boolean | null;
    tiempoRestante: number;
}

export const PaymentContext = createContext<PaymentContextType>({
    procesarPago: async () => { },
    estadoPago: 'Verificando...',
    esExitoso: null,
    tiempoRestante: 7,
});

export const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useContext(AuthContext);  // Accede al contexto de autenticación
    const [estadoPago, setEstadoPago] = useState<string>('Verificando...');
    const [esExitoso, setEsExitoso] = useState<boolean | null>(null);
    const [tiempoRestante, setTiempoRestante] = useState<number>(7);
    const [consultaCompletada, setConsultaCompletada] = useState<boolean>(false);
    const { vaciarCarrito } = useCart();
    const navigate = useNavigate();

    const usuarioCorreo = user?.email;

    const consultarPago = async (resourcePath: string) => {
        try {
            if (consultaCompletada) {
                return;
            }
            setConsultaCompletada(true);

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/checkout/resultado?id=${resourcePath}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': import.meta.env.VITE_API_KEY,
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

            if (!code || !description) {
                console.error('❌ No se recibió información completa.');
                setEstadoPago('❌ No se recibió la información necesaria del pago.');
                setEsExitoso(false);
                return;
            }
            setEstadoPago(description); // Mostrar la descripción de la respuesta
            setEsExitoso(code.startsWith('000')); // Si el código empieza con 000, se considera exitoso

            if (code.startsWith('000')) {
                vaciarCarrito();
            }
            await registrarPago(resourcePath, description, code, code.startsWith('000'), usuarioCorreo);

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

    // Función para registrar el pago
    const registrarPago = async (resourcePath: string, estadoPago: string, codigoPago: string, esExitoso: boolean, usuarioCorreo: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/procesar-pago`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resourcePath,
                    estadoPago,
                    codigoPago,
                    esExitoso: esExitoso ? 1 : 0,
                    usuarioCorreo
                }),
            });

            if (!res.ok) {
                throw new Error('❌ Error al registrar el pago');
            }
        } catch (error) {
            console.error('❌ Error al registrar el pago:', error);
        }
    };

    const procesarPago = async (resourcePath: string) => {
        await consultarPago(resourcePath);
    };

    return (
        <PaymentContext.Provider value={{
            procesarPago,
            estadoPago,
            esExitoso,
            tiempoRestante
        }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => useContext(PaymentContext);
