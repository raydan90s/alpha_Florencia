import { useState } from 'react';

export type OrderStatus = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';

interface OrderFiltersProps {
  currentStatus: OrderStatus | 'all';
  currentDateRange: { from?: string; to?: string };
  onFilterChange: (filters: { 
    status: OrderStatus | 'all'; 
    dateRange: { from?: string; to?: string } 
  }) => void;
}

const OrderFilters = ({ currentStatus, currentDateRange, onFilterChange }: OrderFiltersProps) => {
  const [tempDateRange, setTempDateRange] = useState(currentDateRange);

  const statusOptions = [
    { value: 'all' as const, label: 'Todos los estados', color: 'bg-gray-100 text-gray-800' },
    { value: 'procesando' as const, label: 'Procesando', color: 'bg-blue-100 text-blue-800' },
    { value: 'enviado' as const, label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
    { value: 'entregado' as const, label: 'Entregado', color: 'bg-green-100 text-green-800' },
    { value: 'cancelado' as const, label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  ];

  const quickDateRanges = [
    { 
      label: 'Último mes', 
      getValue: () => {
        const to = new Date();
        const from = new Date();
        from.setMonth(from.getMonth() - 1);
        return { 
          from: from.toISOString().split('T')[0], 
          to: to.toISOString().split('T')[0] 
        };
      }
    },
    { 
      label: 'Últimos 3 meses', 
      getValue: () => {
        const to = new Date();
        const from = new Date();
        from.setMonth(from.getMonth() - 3);
        return { 
          from: from.toISOString().split('T')[0], 
          to: to.toISOString().split('T')[0] 
        };
      }
    },
    { 
      label: 'Este año', 
      getValue: () => {
        const to = new Date();
        const from = new Date(to.getFullYear(), 0, 1);
        return { 
          from: from.toISOString().split('T')[0], 
          to: to.toISOString().split('T')[0] 
        };
      }
    },
  ];

  const handleStatusChange = (status: OrderStatus | 'all') => {
    onFilterChange({ status, dateRange: currentDateRange });
  };

  const handleDateRangeChange = (field: 'from' | 'to', value: string) => {
    const newDateRange = { ...tempDateRange, [field]: value };
    setTempDateRange(newDateRange);
    onFilterChange({ status: currentStatus, dateRange: newDateRange });
  };

  const handleQuickDateRange = (range: { from: string; to: string }) => {
    setTempDateRange(range);
    onFilterChange({ status: currentStatus, dateRange: range });
  };

  const clearDateRange = () => {
    const emptyRange = {};
    setTempDateRange(emptyRange);
    onFilterChange({ status: currentStatus, dateRange: emptyRange });
  };

  return (
    <div className="bg-white border rounded-lg p-4 mb-6 space-y-4">
      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado del pedido
        </label>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`
                px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
                ${currentStatus === option.value
                  ? option.color + ' ring-2 ring-offset-1 ring-blue-500'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rango de fechas
        </label>
        
        {/* Quick Date Ranges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {quickDateRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => handleQuickDateRange(range.getValue())}
              className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
            >
              {range.label}
            </button>
          ))}
          <button
            onClick={clearDateRange}
            className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            Limpiar
          </button>
        </div>

        {/* Custom Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Desde</label>
            <input
              type="date"
              value={tempDateRange.from || ''}
              onChange={(e) => handleDateRangeChange('from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Hasta</label>
            <input
              type="date"
              value={tempDateRange.to || ''}
              onChange={(e) => handleDateRangeChange('to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(currentStatus !== 'all' || currentDateRange.from || currentDateRange.to) && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Filtros activos:</p>
          <div className="flex flex-wrap gap-2">
            {currentStatus !== 'all' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                Estado: {statusOptions.find(s => s.value === currentStatus)?.label}
              </span>
            )}
            {currentDateRange.from && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                Desde: {currentDateRange.from}
              </span>
            )}
            {currentDateRange.to && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                Hasta: {currentDateRange.to}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;