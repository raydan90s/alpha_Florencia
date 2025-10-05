interface OrderTableProps {
  pedidos: any[];
  abrirModalDetalles: (pedido: any) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ pedidos, abrirModalDetalles }) => (
  <div className="bg-white rounded-lg shadow overflow-x-auto">
    <table className="min-w-full text-sm text-gray-800 divide-y divide-gray-200">
      <thead className="bg-gray-100 text-xs uppercase font-semibold">
        <tr>
          <th className="px-6 py-3 text-left">ID</th>
          <th className="px-6 py-3 text-left">Usuario</th>
          <th className="px-6 py-3 text-left">Fecha</th>
          <th className="px-6 py-3 text-left">Total</th>
          <th className="px-6 py-3 text-left">Provincia</th>
          <th className="px-6 py-3 text-left">Ciudad</th>
          <th className="px-6 py-3 text-left">Estado</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <tr key={pedido.id_pedido} className="hover:bg-gray-50">
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
                {new Date(pedido.fecha_pedido).toLocaleDateString("es-EC", { year: "numeric", month: "long", day: "numeric" })}
              </td>
              <td className="px-6 py-4 font-semibold">
                {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(pedido.total)}
              </td>
              <td className="px-6 py-4">{pedido.provincia || "No disponible"}</td> {/* Aquí debe mostrar la provincia */}
              <td className="px-6 py-4">{pedido.ciudad || "No disponible"}</td> {/* Aquí debe mostrar la ciudad */}
              <td className="px-6 py-4">
                {/* Resaltar el estado */}
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${pedido.estado === 'completado'
                      ? 'bg-[#D1FAE5] text-[#065F46]'  // Verde suave de fondo y verde oscuro de texto
                      : pedido.estado === 'en proceso'
                        ? 'bg-[#FEF3C7] text-[#92400E]'  // Amarillo suave de fondo y marrón oscuro de texto
                        : 'bg-[#F3F4F6] text-[#1F2937]'  // Gris claro de fondo y gris oscuro de texto
                    }`}
                >
                  {pedido.estado}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="text-center py-8 text-gray-500">
              No hay compras registradas.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default OrderTable;
