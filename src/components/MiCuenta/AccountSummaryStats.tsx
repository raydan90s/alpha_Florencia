interface AccountSummaryStatsProps {
  stats?: {
    direcciones?: number;
    pedidos?: number;
    totalGastado?: number;
  };
}

const AccountSummaryStats = ({ stats}: AccountSummaryStatsProps) => {

  const { direcciones = 0, pedidos = 0, totalGastado = 0 } = stats || {};

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Resumen de Cuenta</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{direcciones}</div>
          <div className="text-sm text-gray-600">Direcciones Guardadas</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{pedidos}</div>
          <div className="text-sm text-gray-600">Pedidos Totales</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">${totalGastado.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Gastado</div>
        </div>
      </div>
    </div>
  );
};

export default AccountSummaryStats;
