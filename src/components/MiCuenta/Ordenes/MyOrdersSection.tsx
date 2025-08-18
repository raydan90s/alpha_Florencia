'use client';

import { AuthContext } from '../../../context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { useOrders } from '../../../hooks/useOrders';
import OrderFilters from './OrderFilters';
import OrdersList from './OrdersList';
import OrderDetailsUserModal from './OrderDetailsUserModal'; // tu modal para usuario


export type OrderStatus = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';

const OrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const userId = user?.id;
  const { orders, loading, error, fetchOrders, cancelOrder, reorderItems } = useOrders(userId);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && userId) {
      fetchOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        ...dateRange,
        page: currentPage,
        limit: 10
      });
    }
  }, [mounted, userId, statusFilter, dateRange, currentPage, fetchOrders]);

  if (!mounted) {
    return <p className="text-center py-8">Cargando...</p>;
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-5 text-center">
        <p className="text-gray-600">Por favor inicia sesión para ver tus pedidos.</p>
      </div>
    );
  }

  const handleFilterChange = (filters: {
    status: OrderStatus | 'all';
    dateRange: { from?: string; to?: string }
  }) => {
    setStatusFilter(filters.status);
    setDateRange(filters.dateRange);
    setCurrentPage(1); // Reset a la primera página cuando cambian los filtros
  };


  const handleViewDetail = (orderId: number) => {
    const pedido = orders.find(o => o.id === orderId);
    if (!pedido) return;

    setPedidoSeleccionado(pedido);
    setModalAbierto(true);
  };


  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('¿Estás seguro de que quieres cancelar este pedido?')) return;

    try {
      await cancelOrder(orderId);
      alert('Pedido cancelado exitosamente');
    } catch (err: any) {
      alert(err.message || 'Error al cancelar pedido');
    }
  };

  const handleReorder = async (orderId: number) => {
    try {
      await reorderItems(orderId);
      alert('Productos agregados al carrito');
    } catch (err: any) {
      alert(err.message || 'Error al reordenar');
    }
  };

  const handleCerrarModal = () => {
    setPedidoSeleccionado(null);
    setModalAbierto(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Mis Pedidos</h1>
        <p className="text-gray-600">Revisa el historial y estado de tus compras</p>
      </div>

      <OrderFilters
        currentStatus={statusFilter}
        currentDateRange={dateRange}
        onFilterChange={handleFilterChange}
      />

      <OrdersList
        orders={orders}
        loading={loading}
        error={error}
        onViewDetail={handleViewDetail}
        onCancel={handleCancelOrder}
        onReorder={handleReorder}
      />

      {modalAbierto && pedidoSeleccionado && (
        <OrderDetailsUserModal
          pedidoSeleccionado={pedidoSeleccionado}
          cerrarModal={handleCerrarModal}
        />
      )}

    </div>
  );
};

export default OrdersPage;