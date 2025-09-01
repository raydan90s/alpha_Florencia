'use client';

import { AuthContext } from '../context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';

// Definición de tipos para los datos del pedido
interface Pedido {
  id: number;
  numero_pedido: string;
  fecha_pedido: string;
  total: string;
  estado_pago: string;
  estado_envio: string;
}

const HistoryPage = () => {
  const { user } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        setError(null);
        // Usa la ruta de API para obtener el historial de pedidos
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/historial-pedidos?id_usuario=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Asegúrate de tener un token
          }
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Error al cargar el historial de pedidos.');
        }

        const data = await res.json();
        setPedidos(data);
      } catch (err: any) {
        console.error('Error fetching order history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [user]); // Depende del usuario para recargar si cambia

  if (loading) {
    return <p className="text-center mt-10">Cargando historial de pedidos...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">Por favor, inicia sesión para ver tu historial de pedidos.</p>;
  }

  if (pedidos.length === 0) {
    return <p className="text-center mt-10">No tienes pedidos en tu historial.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Historial de Pedidos</h1>
      <div className="shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Número de Pedido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado de Pago</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado de Envío</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">{pedido.numero_pedido}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">${parseFloat(pedido.total).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pedido.estado_pago}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pedido.estado_envio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Link href={`/mi-cuenta/pedido/${pedido.id}`} className="text-blue-600 hover:text-blue-800 font-semibold">
                    Ver Detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;