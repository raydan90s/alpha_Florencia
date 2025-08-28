import React, { useState, useEffect } from "react";

interface ProductoPedido {
    id_producto: number;
    nombre_producto: string;
    precio_unitario: number;
    cantidad: number;
    subtotal: number;
    iva_unitario?: number;
    imagen_producto?: string;
}

interface DetallePedidoUsuario {
    direccion_envio?: string;
    nombrePedido?: string;
    numeroTelefono?: string;
    numeroIdentificacion?: string;
    nota?: string;
    productos?: ProductoPedido[];
    envio?: number; // tomado de la base
}

interface OrderDetailsUserModalProps {
    pedidoSeleccionado: any;
    cerrarModal: () => void;
}

const OrderDetailsUserModal: React.FC<OrderDetailsUserModalProps> = ({ pedidoSeleccionado, cerrarModal }) => {
    const [detalles, setDetalles] = useState<DetallePedidoUsuario | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const obtenerDetallesDelPedido = async () => {
            if (!pedidoSeleccionado) {
                setIsLoading(false);
                return;
            }
            const id = pedidoSeleccionado.id_pedido ?? pedidoSeleccionado.id;
            setIsLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pedidos/${id}/detalles`, {
                    headers: {
                        'X-API-Key': import.meta.env.VITE_API_KEY,
                    }
                });
                const data = await response.json();
                setDetalles(data);
            } catch (error) {
                console.error("Error al obtener los detalles del pedido:", error);
            } finally {
                setIsLoading(false);
            }
        };
        obtenerDetallesDelPedido();
    }, [pedidoSeleccionado]);

    // Subtotal de productos (tomado de la base)
    const calcularSubtotalProductos = () => {
        if (!detalles?.productos) return 0;
        return detalles.productos.reduce((acc, p) => acc + p.precio_unitario * p.cantidad, 0);
    };

    // IVA total de productos
    const calcularIVAProductos = () => {
        if (!detalles?.productos) return 0;
        return detalles.productos.reduce((acc, p) => acc + (p.iva_unitario || 0), 0);
    };

    // IVA sobre envío (15% fijo)
    const calcularIVAEnvio = () => {
        return (detalles?.envio || 0) * 0.15;
    };

    // Total final
    const calcularTotal = () => {
        const subtotalProductos = calcularSubtotalProductos();
        const ivaProductos = calcularIVAProductos();
        const envio = detalles?.envio || 0;
        const ivaEnvio = calcularIVAEnvio();
        return subtotalProductos + envio + ivaProductos + ivaEnvio;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">
                        📋 Detalles del Pedido #{pedidoSeleccionado?.id_pedido}
                    </h3>
                    <button
                        onClick={cerrarModal}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-4 text-gray-600">Cargando detalles...</span>
                        </div>
                    ) : detalles ? (
                        <div>
                            {/* Info del Pedido */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                                {detalles.nota && (
                                    <div className="col-span-2">
                                        <span className="text-sm font-medium text-gray-600">Nota:</span>
                                        <p className="text-lg font-medium text-gray-800">{detalles.nota}</p>
                                    </div>
                                )}
                            </div>

                            {/* Productos */}
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Productos del Pedido</h4>
                            {detalles.productos && detalles.productos.length > 0 ? (
                                detalles.productos.map((producto) => (
                                    <div key={producto.id_producto} className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4 mb-3">
                                        <img
                                            src={producto.imagen_producto || "https://via.placeholder.com/80x80?text=Sin+Imagen"}
                                            alt={producto.nombre_producto}
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <h5 className="font-semibold text-gray-800 text-lg">{producto.nombre_producto}</h5>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Precio unitario:</span>
                                                    <p className="font-medium text-gray-800">
                                                        {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(producto.precio_unitario)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Cantidad:</span>
                                                    <p className="font-medium text-gray-800">{producto.cantidad} unidad{producto.cantidad !== 1 ? 'es' : ''}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">IVA:</span>
                                                    <p className="font-medium text-gray-800">
                                                        {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(producto.iva_unitario || 0)}
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

                            {/* Resumen de Pago */}
                            <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Resumen de Pago</h4>
                            <div className="bg-gray-100 p-4 rounded-lg text-right">
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-600">Subtotal de productos:</span>
                                    <span className="font-medium text-gray-800">
                                        {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(calcularSubtotalProductos())}
                                    </span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-600">Envío:</span>
                                    <span className="font-medium text-gray-800">
                                        {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(detalles?.envio || 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-600">IVA productos:</span>
                                    <span className="font-medium text-gray-800">
                                        {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(calcularIVAProductos())}
                                    </span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-600">IVA envío (15%):</span>
                                    <span className="font-medium text-gray-800">
                                        {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(calcularIVAEnvio())}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t pt-2 mt-2">
                                    <span className="text-gray-800 font-semibold">Total:</span>
                                    <span className="font-bold text-green-600">
                                        {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(calcularTotal())}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No se encontraron detalles para este pedido.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
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

export default OrderDetailsUserModal;
