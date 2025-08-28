import React, { useState, useEffect } from "react";
import BillingModal from "./BillingModal";

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
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [detalles, setDetalles] = useState<DetallePedidoAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetalles = async () => {
      if (!pedidoSeleccionado?.id_pedido) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pedidos/${pedidoSeleccionado.id_pedido}/detalles`, {
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
    fetchDetalles();
  }, [pedidoSeleccionado]);

  // Función para cerrar modal al presionar ESC
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cerrarModal();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [cerrarModal]);

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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && cerrarModal()}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header - Fijo */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center flex-shrink-0 rounded-t-lg">
          <div>
            <h3 className="text-xl font-bold text-gray-800">📋 Pedido #{pedidoSeleccionado?.id_pedido}</h3>
            <p className="text-sm text-gray-600">Usuario ID: {detalles?.id_usuario}</p>
            <p className="text-sm text-gray-600">Estado: {detalles?.estado}</p>
          </div>
          <button
            onClick={cerrarModal}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
            title="Cerrar modal (ESC)"
          >
            ×
          </button>
        </div>

        {/* Body - Scrolleable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-4 text-gray-600">Cargando detalles...</span>
              </div>
            ) : detalles ? (
              <div className="space-y-6">
                {/* Información general del pedido */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">📋</span>
                    Información del Pedido
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Dirección de envío:</span>
                      <p className="text-base font-medium text-gray-800">{detalles.direccion_envio || "No disponible"}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Provincia / Ciudad:</span>
                      <p className="text-base font-medium text-gray-800">{detalles.provincia || ""} / {detalles.ciudad || ""}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Nombre en pedido:</span>
                      <p className="text-base font-medium text-gray-800">{detalles.nombrePedido || "No disponible"}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Teléfono / Identificación:</span>
                      <p className="text-base font-medium text-gray-800">{detalles.numeroTelefono || ""} / {detalles.numeroIdentificacion || ""}</p>
                    </div>
                    {detalles.nota && (
                      <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                        <span className="text-sm font-medium text-gray-600">Nota:</span>
                        <p className="text-base font-medium text-gray-800">{detalles.nota}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">ID de pago:</span>
                      <p className="text-base font-medium text-gray-800 break-all">{detalles.id_pago || "No disponible"}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">ID de anulación:</span>
                      <p className="text-base font-medium text-gray-800">{detalles.id_anulacion || "No disponible"}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Envío:</span>
                      <p className="text-base font-medium text-green-600">${detalles.envio || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">IVA Porcentaje:</span>
                      <p className="text-base font-medium text-gray-800">{detalles.iva_valor || 0}%</p>
                    </div>

                    {/* Botón de facturación */}
                    <div className="p-3 rounded-lg flex justify-start">
                      <button
                        onClick={() => setShowBillingModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        Ver datos de facturación
                      </button>
                    </div>
                  </div>
                </div>

                {/* Productos */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    Productos del Pedido
                  </h4>
                  {detalles.productos && detalles.productos.length > 0 ? (
                    <div className="space-y-3">
                      {detalles.productos.map((producto) => (
                        <div key={producto.id_producto} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-start space-x-4">
                            <img
                              src={producto.imagen_producto || "https://via.placeholder.com/80x80?text=Sin+Imagen"}
                              alt={producto.nombre_producto}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-300 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-gray-800 text-lg mb-2">{producto.nombre_producto}</h5>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div className="bg-white p-2 rounded border">
                                  <span className="text-gray-600 block">Precio unitario:</span>
                                  <p className="font-medium text-gray-800">${producto.precio_unitario}</p>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <span className="text-gray-600 block">Cantidad:</span>
                                  <p className="font-medium text-gray-800">{producto.cantidad}</p>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <span className="text-gray-600 block">Descuento:</span>
                                  <p className="font-medium text-red-600">${producto.descuento_unitario || 0}</p>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <span className="text-gray-600 block">IVA:</span>
                                  <p className="font-medium text-blue-600">${producto.iva_unitario || 0}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <p>No se encontraron productos para este pedido.</p>
                    </div>
                  )}
                </div>

                {/* Resumen de Pago */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    Resumen de Pago
                  </h4>
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg border">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Subtotal productos:</span>
                        <span className="font-medium text-gray-800">${calcularSubtotalProductos().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Envío:</span>
                        <span className="font-medium text-gray-800">${detalles?.envio || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">IVA productos:</span>
                        <span className="font-medium text-blue-600">
                          ${(detalles?.productos?.reduce((acc, p) => acc + (p.iva_unitario || 0), 0) || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">IVA envío ({detalles?.iva_valor || 0}%):</span>
                        <span className="font-medium text-blue-600">${calcularIVAEnvio().toFixed(2)}</span>
                      </div>
                      <div className="border-t-2 border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-800">Total:</span>
                          <span className="text-xl font-bold text-green-600">${calcularTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No se encontraron detalles para este pedido.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fijo */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end flex-shrink-0 rounded-b-lg">
          <button
            onClick={cerrarModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal de facturación */}
      {showBillingModal && (
        <BillingModal
          pedidoId={detalles?.id_pedido || 0}
          cerrarModal={() => setShowBillingModal(false)}
        />
      )}
    </div>
  );
};

export default OrderHistoryModal;