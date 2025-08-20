import React, { useState, useEffect } from "react";

interface ProductoAdmin {
  id_producto: number;
  nombre_producto: string;
  precio_unitario: number;
  cantidad: number;
  descuento_unitario?: number;
  iva_unitario?: number;
  subtotal?: number;
  imagen_producto?: string;
}

interface DetallePedidoAdmin {
  id_pedido: number;
  id_usuario: number;
  fecha_pedido: string;
  estado: string;
  total: number;
  direccion_envio?: string;
  provincia?: string;
  ciudad?: string;
  numeroIdentificacion?: string;
  numeroTelefono?: string;
  nombrePedido?: string;
  nota?: string;
  id_pago?: string;
  id_anulacion?: string;
  envio?: number;
  iva_valor?: number;
  productos?: ProductoAdmin[];
}

interface OrderDetailsAdminModalProps {
  pedidoSeleccionado: any;
  cerrarModal: () => void;
}

const OrderHistoryModal: React.FC<OrderDetailsAdminModalProps> = ({ pedidoSeleccionado, cerrarModal }) => {
  const [detalles, setDetalles] = useState<DetallePedidoAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetalles = async () => {
      if (!pedidoSeleccionado?.id_pedido) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pedidos/${pedidoSeleccionado.id_pedido}/detalles`);
        const data = await response.json();
        setDetalles(data);
      } catch (error) {
        console.error("Error al obtener los detalles del pedido:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetalles();
  }, [pedidoSeleccionado]);

  // Función para calcular subtotal de productos
  const calcularSubtotalProductos = () => {
    if (!detalles?.productos) return 0;
    return detalles.productos.reduce(
      (acc, p) => acc + (p.precio_unitario - (p.descuento_unitario || 0)) * p.cantidad,
      0
    );
  };

  // Función para calcular IVA de envío
  const calcularIVAEnvio = () => {
    if (!detalles?.envio || !detalles?.iva_valor) return 0;
    return detalles.envio * (detalles.iva_valor / 100);
  };

  // Total final
  const calcularTotal = () => {
    const subtotal = calcularSubtotalProductos();
    const envio = detalles?.envio || 0;
    const ivaEnvio = calcularIVAEnvio();
    const ivaProductos = detalles?.productos?.reduce((acc, p) => acc + (p.iva_unitario || 0), 0) || 0;
    return subtotal + envio + ivaProductos + ivaEnvio;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">📋 Pedido #{pedidoSeleccionado?.id_pedido}</h3>
            <p className="text-sm text-gray-600">Usuario ID: {detalles?.id_usuario}</p>
            <p className="text-sm text-gray-600">Estado: {detalles?.estado}</p>
          </div>
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
              {/* Información general del pedido */}
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Información del Pedido</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm font-medium text-gray-600">Dirección de envío:</span>
                  <p className="text-lg font-medium text-gray-800">{detalles.direccion_envio || "No disponible"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Provincia / Ciudad:</span>
                  <p className="text-lg font-medium text-gray-800">{detalles.provincia || ""} / {detalles.ciudad || ""}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Nombre en pedido:</span>
                  <p className="text-lg font-medium text-gray-800">{detalles.nombrePedido || "No disponible"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Teléfono / Identificación:</span>
                  <p className="text-lg font-medium text-gray-800">{detalles.numeroTelefono || ""} / {detalles.numeroIdentificacion || ""}</p>
                </div>
                {detalles.nota && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-600">Nota:</span>
                    <p className="text-lg font-medium text-gray-800">{detalles.nota}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-600">ID de pago:</span>
                  <p className="text-lg font-medium text-gray-800">{detalles.id_pago || "No disponible"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">ID de anulación:</span>
                  <p className="text-lg font-medium text-gray-800">{detalles.id_anulacion || "No disponible"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Envío:</span>
                  <p className="text-lg font-medium text-gray-800">${detalles.envio || 0}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">IVA Porcentaje:</span>
                  <p className="text-lg font-medium text-gray-800">{detalles.iva_valor || 0}%</p>
                </div>
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
                          <p className="font-medium text-gray-800">${producto.precio_unitario}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Cantidad:</span>
                          <p className="font-medium text-gray-800">{producto.cantidad}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Descuento:</span>
                          <p className="font-medium text-gray-800">${producto.descuento_unitario || 0}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">IVA:</span>
                          <p className="font-medium text-gray-800">${producto.iva_unitario || 0}</p>
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
                  <span className="text-gray-600">Subtotal productos:</span>
                  <span className="font-medium text-gray-800">${calcularSubtotalProductos().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-medium text-gray-800">${detalles?.envio || 0}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">IVA productos:</span>
                  <span className="font-medium text-gray-800">
                    ${detalles?.productos?.reduce((acc, p) => acc + (p.iva_unitario || 0), 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">IVA envío ({detalles?.iva_valor || 0}%):</span>
                  <span className="font-medium text-gray-800">${calcularIVAEnvio().toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="font-bold text-green-600">${calcularTotal().toFixed(2)}</span>
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

export default OrderHistoryModal;
