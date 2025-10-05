import { useState, useCallback } from 'react';

export interface Order {
  id: number;
  numero_orden: string;
  fecha_creacion: string;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  total: number;
  total_productos: number;
  estado_pago?: string;
  items?: OrderItem[];
  direccion_envio?: {
    direccion: string;
    ciudad: string;
    provincia: string;
  };
  nombre_pedido?: string;
  telefono?: string;
  identificacion?: string;
  nota?: string;
}

export interface OrderItem {
  id: number;
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  imagen_url?: string;
}

interface FetchOrdersParams {
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const useOrders = (userId?: number) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchOrders = useCallback(async (params: FetchOrdersParams = {}) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params.status && params.status !== 'all') queryParams.append('status', params.status);
      if (params.from) queryParams.append('from', params.from);
      if (params.to) queryParams.append('to', params.to);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const url = `${import.meta.env.VITE_API_BASE_URL}/api/usuarios/${userId}/pedidos${queryParams.toString() ? `?${queryParams.toString()}` : ''
        }`;

      const res = await fetch(url, {
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY
        },
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      setOrders(data.orders || []);
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalOrders: 0,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Error desconocido al cargar pedidos');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchOrderDetail = useCallback(async (orderId: number) => {
    if (!userId) return null;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/${userId}/pedidos/${orderId}`, {
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY,
        }
      });
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error('Error fetching order detail:', err);
      throw new Error(err.message || 'Error desconocido al cargar detalle del pedido');
    }
  }, [userId]);

  const cancelOrder = useCallback(async (orderId: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pedidos/${orderId}/cancelar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_KEY,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al cancelar pedido');
      }

      // Actualizar la lista después de cancelar
      await fetchOrders();
    } catch (err: any) {
      throw new Error(err.message || 'Error desconocido');
    }
  }, [fetchOrders]);

  const reorderItems = useCallback(async (orderId: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pedidos/${orderId}/reordenar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_KEY
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al reordenar');
      }

      const data = await res.json();
      return data; // Retorna la información del nuevo pedido o carrito
    } catch (err: any) {
      throw new Error(err.message || 'Error desconocido');
    }
  }, []);

  return {
    orders,
    loading,
    error,
    pagination,
    fetchOrders,
    fetchOrderDetail,
    cancelOrder,
    reorderItems,
  };
};