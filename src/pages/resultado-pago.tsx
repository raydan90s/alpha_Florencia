import { useContext, useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import { AuthContext } from '../context/AuthContext';
import { enviarCorreoConfirmacionCompra } from '../utils/enviarCorreo';
import Billing from '../components/Checkout/Billing';
import type { BillingHandle } from '../components/Checkout/Billing';
import type { DireccionEnvio } from '../types/direccionEnvio';

type Configuracion = {
    id: number;
    precio_envio: number;
    id_iva: number;
    iva: number;
};

const ResultadoPago = () => {
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const [estadoPago, setEstadoPago] = useState<string>('Verificando...');
    const [esExitoso, setEsExitoso] = useState<boolean | null>(null);
    const [consultaCompletada, setConsultaCompletada] = useState<boolean>(false);
    const [tiempoRestante, setTiempoRestante] = useState<number>(10);
    const navigate = useNavigate();
    const { cartItems, vaciarCarrito } = useCart();
    const usuarioId = user?.id;
    const billingRef = useRef<BillingHandle>(null);

    const [direccionEnvioLocal] = useState<any | null>(() => {
        try {
            const storedDireccion = sessionStorage.getItem('direccionEnvio');
            if (storedDireccion) {
                return JSON.parse(storedDireccion);
            }
        } catch (e) {
            console.error("❌ Error al parsear la dirección de sessionStorage:", e);
        }
        return null;
    });

    const registrarPago = async (
        total: string,
        iva: string,
        resourcePath: string,
        estadoPago: string,
        codigoPago: string,
        esExitoso: boolean,
        usuarioId: number,
        cartItems: any,
        direccionEnvio: any,
        id_pago: string,
        envio: string,
        facturacionId: number,
    ) => {
        const productosCarrito = {
            total,
            productos: cartItems,
            iva,
            envio: envio
        };

        if (!productosCarrito.total || productosCarrito.productos.length === 0) {
            throw new Error("❌ El carrito de productos no contiene los datos necesarios.");
        }

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
                id_pago,
                facturacionId
            }),
        });

        if (!res.ok) {
            throw new Error('❌ Error al registrar el pago');
        }

        return await res.json();
    };

    const consultarPago = async (resourcePath: string) => {
        try {
            if (consultaCompletada) return;
            setConsultaCompletada(true);

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/checkout/resultado?id=${resourcePath}`, {
                headers: {
                    'X-API-Key': import.meta.env.VITE_API_KEY,
                }
            });
            if (!res.ok) {
                setEstadoPago(`Error: ${res.statusText}`);
                setEsExitoso(false);
                return;
            }


            const data = await res.json();
            const code = data.result?.code;
            const description = data.result?.description;
            const id_pago = data.id;
            const email = data.customer?.email;
            const amount = data.amount;
            const iva_pedido = data.customParameters?.SHOPPER_VAL_IVA;

            if (!code || !description) {
                setEstadoPago('❌ No se recibió la información necesaria del pago.');
                setEsExitoso(false);
                return;
            }

            setEstadoPago(description);
            const esExitosoLocal = code.startsWith('000');
            setEsExitoso(esExitosoLocal);

            // Consulta configuración
            const urlConfig = `${import.meta.env.VITE_API_BASE_URL}/api/configuracion`;
            const resConfig = await fetch(urlConfig, {
                headers:{
                    'X-API-Key': import.meta.env.VITE_API_KEY,
                }
            });
            if (!resConfig.ok) throw new Error('❌ Error cargando configuración');
            const configData: Configuracion = await resConfig.json();

            const cost = {
                shipping: configData.precio_envio,
                tax: Number(iva_pedido) || configData.iva,
                total: parseFloat(amount)
            };

            if (esExitosoLocal) {
                let facturacionId: number | null = null;
                let billingDataLocal: DireccionEnvio | null = null;

                if (billingRef.current) {
                    facturacionId = await billingRef.current.enviarFacturacion();
                } else {
                    const stored = sessionStorage.getItem('direccionFacturacion');
                    if (stored) {
                        try {
                            billingDataLocal = JSON.parse(stored);
                            facturacionId = billingDataLocal?.id || null;
                        } catch (error) {
                            console.error('❌ Error parseando billingData desde sessionStorage:', error);
                        }
                    }
                }
                console.log("🔹 Dirección de envío:", direccionEnvioLocal);
                console.log("🔹 Carrito de productos:", cartItems);
                console.log("🔹 Facturación ID:", facturacionId);

                if (facturacionId !== null) {
                    const res = await registrarPago(
                        amount,
                        configData.iva.toString(),
                        resourcePath,
                        description,
                        code,
                        true,
                        usuarioId!,
                        cartItems,
                        direccionEnvioLocal!,
                        id_pago,
                        configData.precio_envio.toString(),
                        facturacionId
                    );

                    const idPagoFormateado = String(res.pedidoId).padStart(6, '0');
                    //await enviarCorreoConfirmacionCompra(email, idPagoFormateado, cartItems, cost);
                    vaciarCarrito();
                }

                else {
                    console.error("❌ No se pudo registrar la facturación, facturacionId es null");
                }

                sessionStorage.removeItem('direccionEnvio');
                setTiempoRestante(7);

                const countdownInterval = setInterval(() => {
                    setTiempoRestante(prev => {
                        if (prev <= 1) {
                            clearInterval(countdownInterval);
                            navigate(esExitosoLocal ? '/' : '/carrito');
                            setTimeout(() => window.location.reload(), 100);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('❌ Error al consultar pago:', error.message);
                setEstadoPago(`Error al consultar pago: ${error.message}`);
            } else {
                console.error('❌ Error desconocido:', error);
                setEstadoPago('❌ Error desconocido');
            }
            setEsExitoso(false);
        }
    };

    useEffect(() => {
        const resourcePath = searchParams.get('resourcePath');
        if (!resourcePath || !direccionEnvioLocal || consultaCompletada) return;

        const timeoutId = setTimeout(() => {
            if (cartItems.length === 0) {
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
            <div style={{ display: 'none' }}>
                <Billing ref={billingRef} value={direccionEnvioLocal} onChange={() => { }} />
            </div>

            <h1 className="text-2xl font-bold mb-4">Resultado del Pago</h1>
            <p className="text-lg mb-6">{estadoPago}</p>

            {esExitoso !== null && (
                <div className="text-xl font-semibold mb-12">
                    Redirigiendo en {tiempoRestante} segundos...
                </div>
            )}

            {esExitoso !== null && (
                <button
                    onClick={() => navigate(esExitoso ? '/' : '/carrito')}
                    className={`px-6 py-2 rounded text-white transition ${esExitoso ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                    {esExitoso ? 'Volver al inicio' : 'Volver al carrito'}
                </button>
            )}
        </div>
    );
};

export default ResultadoPago;
