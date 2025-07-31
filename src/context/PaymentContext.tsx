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

    const usuarioCorreo = user?.email;  // Usa el correo del usuario autenticado o uno temporal

    // Función para consultar el estado del pago
    const consultarPago = async (resourcePath: string) => {
        try {
            if (consultaCompletada) {
                console.log("✅ La consulta ya fue realizada, no se hace nuevamente.");
                return;
            }

            console.log(`🔍 Consultando resultado de pago con resourcePath: ${resourcePath}`);
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
            console.log('🔍 Respuesta del backend:', data);  // Verifica la respuesta aquí

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

            // Si el pago fue exitoso, vaciar el carrito
            if (code.startsWith('000')) {
                vaciarCarrito();
            }

            // Llamada para registrar el pago en la base de datos
            await registrarPago(resourcePath, description, code, code.startsWith('000'), usuarioCorreo);

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
                    esExitoso: esExitoso ? 1 : 0, // Asegúrate de enviar como 1 o 0
                    usuarioCorreo
                }),
            });

            if (!res.ok) {
                throw new Error('❌ Error al registrar el pago');
            }

            const data = await res.json();
            console.log('✅ Pago registrado en la base de datos:', data);
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
