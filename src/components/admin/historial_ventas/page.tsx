"use client";
import React, { useState, useEffect } from "react";
import { useHistorial } from "../../../context/HistorialContext";

// Interfaz para los detalles del pedido (ajusta según tu estructura de datos)
interface DetallePedido {
  id_detalle?: number;
  nombre_producto: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
  imagen_producto?: string;
}

interface Pedido {
  id_pedido: number;
  nombre_usuario: string;
  fecha_pedido: string;
  total: number;
  estado: string;
  detalles?: DetallePedido[];
}

const HistorialManager: React.FC = () => {
  const {
    pedidos,
    loading,
    error,
    limpiarError,
    filtrarPorUsuario,
  } = useHistorial();

  const [filtroUsuario, setFiltroUsuario] = useState<string>("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState<string>("");
  const [filtroFechaFin, setFiltroFechaFin] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<string>("");

  // Estados para el modal
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [cargandoDetalles, setCargandoDetalles] = useState<boolean>(false);

  useEffect(() => {
  }, [pedidos]);

  // Obtener estados únicos para el selector
  const estadosUnicos = Array.from(new Set(pedidos.map(p => p.estado).filter(Boolean)));

  // Función para aplicar todos los filtros
  const aplicarFiltros = () => {
    let pedidosFiltrados = pedidos;

    // Filtro por usuario
    if (filtroUsuario.trim()) {
      pedidosFiltrados = filtrarPorUsuario(filtroUsuario);
    }

    // Filtro por fecha de inicio
    if (filtroFechaInicio) {
      const fechaInicio = new Date(filtroFechaInicio);
      pedidosFiltrados = pedidosFiltrados.filter(pedido => {
        if (!pedido.fecha_pedido) return false;
        const fechaPedido = new Date(pedido.fecha_pedido);
        return fechaPedido >= fechaInicio;
      });
    }

    // Filtro por fecha de fin
    if (filtroFechaFin) {
      const fechaFin = new Date(filtroFechaFin);
      fechaFin.setHours(23, 59, 59, 999); // Incluir todo el día
      pedidosFiltrados = pedidosFiltrados.filter(pedido => {
        if (!pedido.fecha_pedido) return false;
        const fechaPedido = new Date(pedido.fecha_pedido);
        return fechaPedido <= fechaFin;
      });
    }

    // Filtro por estado
    if (filtroEstado) {
      pedidosFiltrados = pedidosFiltrados.filter(pedido =>
        pedido.estado === filtroEstado
      );
    }

    return pedidosFiltrados;
  };

  const pedidosFiltrados = aplicarFiltros();

  const totalFiltrado = pedidosFiltrados.reduce(
    (acc, p) => acc + p.total,
    0
  );

  // Función para limpiar todos los filtros
  const limpiarTodosFiltros = () => {
    setFiltroUsuario("");
    setFiltroFechaInicio("");
    setFiltroFechaFin("");
    setFiltroEstado("");
  };

  // Verificar si hay algún filtro activo
  const hayFiltrosActivos = filtroUsuario || filtroFechaInicio || filtroFechaFin || filtroEstado;

  // Función para abrir el modal con detalles del pedido
  const abrirModalDetalles = async (pedido: any) => {
    setPedidoSeleccionado(pedido);
    setModalAbierto(true);
    setCargandoDetalles(true);

    try {

      await new Promise(resolve => setTimeout(resolve, 800));

      // Datos de ejemplo - reemplaza con tu estructura real
      const detallesEjemplo: DetallePedido[] = [
        {
          id_detalle: 1,
          nombre_producto: "Producto Ejemplo 1",
          precio_unitario: 15.99,
          cantidad: 2,
          subtotal: 31.98,
          imagen_producto: "https://via.placeholder.com/80x80?text=P1"
        },
        {
          id_detalle: 2,
          nombre_producto: "Producto Ejemplo 2",
          precio_unitario: 25.50,
          cantidad: 1,
          subtotal: 25.50,
          imagen_producto: "https://via.placeholder.com/80x80?text=P2"
        }
      ];

      setPedidoSeleccionado(prev => prev ? { ...prev, detalles: detallesEjemplo } : null);
    } catch (error) {
      console.error("Error al cargar detalles del pedido:", error);
      // Aquí podrías mostrar un mensaje de error
    } finally {
      setCargandoDetalles(false);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPedidoSeleccionado(null);
    setCargandoDetalles(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-600">
        Cargando historial de compras...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">🧾 Historial de Compras</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button
            onClick={limpiarError}
            className="absolute right-2 top-2 text-red-600 hover:text-red-800 text-xl"
            aria-label="Cerrar mensaje de error"
          >
            ×
          </button>
        </div>
      )}

      {/* Panel de Filtros */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">🔍 Filtros de Búsqueda</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por usuario:
            </label>
            <input
              type="text"
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
              placeholder="Ej: juan"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desde fecha:
            </label>
            <input
              type="date"
              value={filtroFechaInicio}
              onChange={(e) => setFiltroFechaInicio(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por Fecha Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hasta fecha:
            </label>
            <input
              type="date"
              value={filtroFechaFin}
              onChange={(e) => setFiltroFechaFin(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado:
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              {estadosUnicos.map(estado => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón para limpiar filtros */}
        {hayFiltrosActivos && (
          <div className="flex justify-end">
            <button
              onClick={limpiarTodosFiltros}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>

      {/* Resumen de resultados */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="text-left">
          <p className="text-sm text-gray-500">
            {hayFiltrosActivos ? "Resultados filtrados:" : "Total de todas las compras:"}
          </p>
          {hayFiltrosActivos && (
            <div className="text-xs text-gray-400 mt-1">
              {filtroUsuario && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1">Usuario: {filtroUsuario}</span>}
              {filtroFechaInicio && <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-1">Desde: {filtroFechaInicio}</span>}
              {filtroFechaFin && <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-1">Hasta: {filtroFechaFin}</span>}
              {filtroEstado && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded mr-1">Estado: {filtroEstado}</span>}
            </div>
          )}
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat("es-EC", {
              style: "currency",
              currency: "USD",
            }).format(totalFiltrado)}
          </p>
          <p className="text-xs text-gray-400">
            {pedidosFiltrados.length} compra
            {pedidosFiltrados.length !== 1 ? "s" : ""}
            {hayFiltrosActivos && ` de ${pedidos.length} total`}
          </p>
        </div>
      </div>

      {/* Tabla de resultados */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800 divide-y divide-gray-200">
          <thead className="bg-gray-100 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Usuario</th>
              <th className="px-6 py-3 text-left">Fecha</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pedidosFiltrados.length > 0 ? (
              pedidosFiltrados.map((pedido) => (
                <tr key={String(pedido.id_pedido)} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{pedido.id_pedido}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => abrirModalDetalles(pedido)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer transition-colors"
                      title="Ver detalles del pedido"
                    >
                      {pedido.nombre_usuario}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {pedido.fecha_pedido
                      ? new Date(pedido.fecha_pedido).toLocaleDateString("es-EC", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : "Sin fecha"}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {new Intl.NumberFormat("es-EC", {
                      style: "currency",
                      currency: "USD",
                    }).format(pedido.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${pedido.estado === 'completado' || pedido.estado === 'Completado'
                        ? 'bg-green-100 text-green-800'
                        : pedido.estado === 'pendiente' || pedido.estado === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : pedido.estado === 'cancelado' || pedido.estado === 'Cancelado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                      {pedido.estado}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  {hayFiltrosActivos
                    ? "No hay compras que coincidan con los filtros aplicados."
                    : "No hay compras registradas."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalles del Pedido */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header del Modal */}
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  📋 Detalles del Pedido #{pedidoSeleccionado?.id_pedido}
                </h3>
                <p className="text-sm text-gray-600">
                  Cliente: {pedidoSeleccionado?.nombre_usuario}
                </p>
              </div>
              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Cerrar modal"
              >
                ×
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Información del Pedido */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Fecha del Pedido:</span>
                  <p className="text-lg font-semibold text-gray-800">
                    {pedidoSeleccionado?.fecha_pedido
                      ? new Date(pedidoSeleccionado.fecha_pedido).toLocaleDateString("es-EC", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : "Sin fecha"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Estado:</span>
                  <p className="text-lg font-semibold">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${pedidoSeleccionado?.estado === 'completado' || pedidoSeleccionado?.estado === 'Completado'
                        ? 'bg-green-100 text-green-800'
                        : pedidoSeleccionado?.estado === 'pendiente' || pedidoSeleccionado?.estado === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : pedidoSeleccionado?.estado === 'cancelado' || pedidoSeleccionado?.estado === 'Cancelado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                      {pedidoSeleccionado?.estado}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Total del Pedido:</span>
                  <p className="text-2xl font-bold text-green-600">
                    {new Intl.NumberFormat("es-EC", {
                      style: "currency",
                      currency: "USD",
                    }).format(pedidoSeleccionado?.total || 0)}
                  </p>
                </div>
              </div>

              {/* Detalles de Productos */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">🛒 Productos del Pedido</h4>

                {cargandoDetalles ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-4 text-gray-600">Cargando detalles...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pedidoSeleccionado?.detalles && pedidoSeleccionado.detalles.length > 0 ? (
                      pedidoSeleccionado.detalles.map((detalle, index) => (
                        <div key={detalle.id_detalle || index} className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                          {/* Imagen del Producto */}
                          <img
                            src={detalle.imagen_producto || "https://via.placeholder.com/80x80?text=Sin+Imagen"}
                            alt={detalle.nombre_producto}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/80x80?text=Sin+Imagen";
                            }}
                          />

                          {/* Información del Producto */}
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 text-lg">{detalle.nombre_producto}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm">
                              <div>
                                <span className="text-gray-600">Precio unitario:</span>
                                <p className="font-medium text-gray-800">
                                  {new Intl.NumberFormat("es-EC", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format(detalle.precio_unitario)}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600">Cantidad:</span>
                                <p className="font-medium text-gray-800">{detalle.cantidad} unidad{detalle.cantidad !== 1 ? 'es' : ''}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Subtotal:</span>
                                <p className="font-bold text-green-600">
                                  {new Intl.NumberFormat("es-EC", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format(detalle.subtotal)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No se encontraron detalles para este pedido.</p>
                        <p className="text-sm mt-2">Es posible que los detalles no estén disponibles o haya ocurrido un error.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Resumen Final */}
              {!cargandoDetalles && pedidoSeleccionado?.detalles && pedidoSeleccionado.detalles.length > 0 && (
                <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Total de {pedidoSeleccionado.detalles.length} producto{pedidoSeleccionado.detalles.length !== 1 ? 's' : ''}:
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-700">
                        {new Intl.NumberFormat("es-EC", {
                          style: "currency",
                          currency: "USD",
                        }).format(pedidoSeleccionado.total)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer del Modal */}
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
      )}
    </div>
  );
};

export default HistorialManager;