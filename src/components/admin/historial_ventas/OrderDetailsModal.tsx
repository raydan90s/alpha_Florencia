import React, { useState, useEffect } from "react";

// Definimos la estructura de los detalles del pedido que vamos a obtener
interface DetallePedido {
    id_producto: number;
    nombre_producto: string;
    precio_unitario: number;
    cantidad: number;
    subtotal: number;
    imagen_producto?: string;
    nota?: string;
    direccion_envio?: string;
    nombrePedido?: string;
    numeroTelefono?: string;
    numeroIdentificacion?: string;
    id_pago?: string;
    estado?:string;
    productos?: Array<{
        id_producto: number;
        nombre_producto: string;
        precio_unitario: number;
        cantidad: number;
        subtotal: number;
        imagen_producto?: string;
    }>;
}

interface OrderDetailsModalProps {
    pedidoSeleccionado: any;
    cargandoDetalles: boolean;
    cerrarModal: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ pedidoSeleccionado, cerrarModal }) => {
    const [detalles, setDetalles] = useState<DetallePedido | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const obtenerDetallesDelPedido = async () => {
            if (pedidoSeleccionado?.id_pedido) {
                setIsLoading(true);
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pedidos/${pedidoSeleccionado.id_pedido}/detalles`);
                    const data = await response.json();
                    console.log("Respuesta de datos", data);

                    setDetalles(data);
                } catch (error) {
                    console.error("Error al obtener los detalles del pedido:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        obtenerDetallesDelPedido();
    }, [pedidoSeleccionado]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">📋 Detalles del Pedido #{pedidoSeleccionado?.id_pedido}</h3>
                        <p className="text-sm text-gray-600">Cliente: {pedidoSeleccionado?.nombre_usuario}</p>
                    </div>
                    <button
                        onClick={cerrarModal}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-4 text-gray-600">Cargando detalles...</span>
                        </div>
                    ) : (
                        <div>
                            {/* Mostrar detalles de los productos aquí */}
                            {detalles ? (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Información del Pedido</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Dirección de Envío:</span>
                                            <p className="text-lg font-medium text-gray-800">{detalles.direccion_envio || "No disponible"}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Nombre en el Pedido:</span>
                                            <p className="text-lg font-medium text-gray-800">{detalles.nombrePedido || "No disponible"}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Número de Teléfono:</span>
                                            <p className="text-lg font-medium text-gray-800">{detalles.numeroTelefono || "No disponible"}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Número de Identificación:</span>
                                            <p className="text-lg font-medium text-gray-800">{detalles.numeroIdentificacion || "No disponible"}</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <span className="text-sm font-medium text-gray-600">Nota:</span>
                                            <p className="text-lg font-medium text-gray-800">{detalles.nota || "No hay nota"}</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <span className="text-sm font-medium text-gray-600">ID de pago:</span>
                                            <p className="text-lg font-medium text-gray-800">{detalles.id_pago || "No hay Pago Disponible"}</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <span className="text-sm font-medium text-gray-600">Estado de Pago:</span>
                                            <p className="text-lg font-medium text-gray-800">{detalles.estado || "No hay Estado Disponible"}</p>
                                        </div>
                                    </div>

                                    {/* Mostrar los productos del pedido */}
                                    <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Productos del Pedido</h4>
                                    {detalles.productos && detalles.productos.length > 0 ? (
                                        detalles.productos.map((producto) => (
                                            <div key={producto.id_producto} className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                                                <img
                                                    src={producto.imagen_producto || "https://via.placeholder.com/80x80?text=Sin+Imagen"}
                                                    alt={producto.nombre_producto}
                                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                />
                                                <div className="flex-1">
                                                    <h5 className="font-semibold text-gray-800 text-lg">{producto.nombre_producto}</h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm">
                                                        <div>
                                                            <span className="text-gray-600">Precio unitario:</span>
                                                            <p className="font-medium text-gray-800">
                                                                {new Intl.NumberFormat("es-EC", {
                                                                    style: "currency",
                                                                    currency: "USD",
                                                                }).format(producto.precio_unitario)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">Cantidad:</span>
                                                            <p className="font-medium text-gray-800">{producto.cantidad} unidad{producto.cantidad !== 1 ? 'es' : ''}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">Subtotal:</span>
                                                            <p className="font-bold text-green-600">
                                                                {new Intl.NumberFormat("es-EC", {
                                                                    style: "currency",
                                                                    currency: "USD",
                                                                }).format(producto.subtotal)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No se encontraron productos para este pedido.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No se encontraron detalles para este pedido.</p>
                                    <p className="text-sm mt-2">Es posible que los detalles no estén disponibles o haya ocurrido un error.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                    <button
                        onClick={cerrarModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
