import { useState, useMemo } from 'react';
import type { Order } from '../../../hooks/useOrders';

interface OrdersListProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  onViewDetail: (orderId: number) => void;
  onCancel: (orderId: number) => void;
  onReorder: (orderId: number) => void;
  itemsPerPage?: number; // opcional, por defecto 10
}

const OrdersList = ({ 
  orders, 
  loading, 
  error, 
  onViewDetail, 
  onCancel, 
  onReorder,
  itemsPerPage = 10
}: OrdersListProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const currentOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return orders.slice(startIndex, endIndex);
  }, [orders, currentPage, itemsPerPage]);

  const getStatusColor = (status: string) => {
    const colors = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'procesando': 'bg-blue-100 text-blue-800',
      'enviado': 'bg-purple-100 text-purple-800',
      'entregado': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando pedidos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-2">Error al cargar pedidos</p>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos</h3>
        <p className="text-gray-600">No se encontraron pedidos con los filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Lista de pedidos */}
      <div className="space-y-4 mb-6">
        {currentOrders.map((order) => (
          <div key={order.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Información principal del pedido */}
              <div className="flex-1 mb-4 lg:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{order.numero_orden}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.estado)}`}>
                    {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">📅</span>
                    {formatDate(order.fecha_creacion)}
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">📦</span>
                    {order.total_productos} producto{order.total_productos !== 1 ? 's' : ''}
                  </div>
                  {order.direccion_envio && (
                    <div className="flex items-center md:col-span-2">
                      <span className="text-gray-400 mr-2">📍</span>
                      {order.direccion_envio.ciudad}, {order.direccion_envio.provincia}
                    </div>
                  )}
                </div>
              </div>

              {/* Total y acciones */}
              <div className="flex flex-col lg:items-end lg:text-right">
                <div className="text-2xl font-bold text-gray-900 mb-3">
                  {formatPrice(order.total)}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onViewDetail(order.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Ver Detalle
                  </button>
                  
                  {order.estado === 'pendiente' && (
                    <button
                      onClick={() => onCancel(order.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                  
                  {(order.estado === 'entregado' || order.estado === 'cancelado') && (
                    <button
                      onClick={() => onReorder(order.id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Reordenar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Anterior
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Info de paginación */}
      <div className="text-center mt-4 text-sm text-gray-600">
        Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, orders.length)} de {orders.length} pedidos
      </div>
    </div>
  );
};

export default OrdersList;
