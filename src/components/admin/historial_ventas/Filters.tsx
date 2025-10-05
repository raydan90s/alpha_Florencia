interface FiltersProps {
  filtroUsuario: string;
  setFiltroUsuario: React.Dispatch<React.SetStateAction<string>>;
  filtroFechaInicio: string;
  setFiltroFechaInicio: React.Dispatch<React.SetStateAction<string>>;
  filtroFechaFin: string;
  setFiltroFechaFin: React.Dispatch<React.SetStateAction<string>>;
  filtroEstado: string;
  setFiltroEstado: React.Dispatch<React.SetStateAction<string>>;
  filtroProvincia: string;
  setFiltroProvincia: React.Dispatch<React.SetStateAction<string>>;
  filtroCiudad: string;
  setFiltroCiudad: React.Dispatch<React.SetStateAction<string>>;
  estadosUnicos: string[];
  provinciasUnicas: string[];  // Nueva propiedad para provincias únicas
  ciudadesUnicas: string[];    // Nueva propiedad para ciudades únicas
  limpiarTodosFiltros: () => void;
  hayFiltrosActivos: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  filtroUsuario,
  setFiltroUsuario,
  filtroFechaInicio,
  setFiltroFechaInicio,
  filtroFechaFin,
  setFiltroFechaFin,
  filtroEstado,
  setFiltroEstado,
  filtroProvincia,
  setFiltroProvincia,
  filtroCiudad,
  setFiltroCiudad,
  estadosUnicos,
  provinciasUnicas,
  ciudadesUnicas,
  limpiarTodosFiltros,
  hayFiltrosActivos
}) => (
  <div className="bg-white p-6 rounded-lg shadow space-y-4">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">🔍 Filtros de Búsqueda</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por usuario:</label>
        <input
          type="text"
          value={filtroUsuario}
          onChange={(e) => setFiltroUsuario(e.target.value)}
          placeholder="Ej: juan"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Desde fecha:</label>
        <input
          type="date"
          value={filtroFechaInicio}
          onChange={(e) => setFiltroFechaInicio(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hasta fecha:</label>
        <input
          type="date"
          value={filtroFechaFin}
          onChange={(e) => setFiltroFechaFin(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          {estadosUnicos.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>

      {/* Nuevo filtro: Provincia */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Provincia:</label>
        <select
          value={filtroProvincia}
          onChange={(e) => setFiltroProvincia(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las provincias</option>
          {provinciasUnicas.map((provincia) => (
            <option key={provincia} value={provincia}>
              {provincia}
            </option>
          ))}
        </select>
      </div>

      {/* Nuevo filtro: Ciudad */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad:</label>
        <select
          value={filtroCiudad}
          onChange={(e) => setFiltroCiudad(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las ciudades</option>
          {ciudadesUnicas.map((ciudad) => (
            <option key={ciudad} value={ciudad}>
              {ciudad}
            </option>
          ))}
        </select>
      </div>
    </div>

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
);

export default Filters;
