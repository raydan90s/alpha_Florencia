import React, { useState, useEffect } from "react";
import { useHistorial } from "../../../context/HistorialContext";
import Filters from "./Filters";
import OrderTable from "./OrderTable";
import OrderDetailsModal from "./OrderDetailsModal";

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
    const [filtroProvincia, setFiltroProvincia] = useState<string>("");  
    const [filtroCiudad, setFiltroCiudad] = useState<string>("");       

    const [modalAbierto, setModalAbierto] = useState<boolean>(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any>(null);
    const [cargandoDetalles, setCargandoDetalles] = useState<boolean>(false);

    useEffect(() => { }, [pedidos]);

    // Obtener valores únicos de estado, provincia y ciudad
    const estadosUnicos = Array.from(new Set(pedidos.map(p => p.estado).filter(Boolean)));
    const provinciasUnicas = Array.from(new Set(pedidos.map(p => p.provincia).filter(Boolean)));
    const ciudadesUnicas = Array.from(new Set(pedidos.map(p => p.ciudad).filter(Boolean)));

    // Función para aplicar filtros
    const aplicarFiltros = () => {
        let pedidosFiltrados = pedidos;

        if (filtroUsuario.trim()) {
            pedidosFiltrados = filtrarPorUsuario(filtroUsuario);
        }

        if (filtroFechaInicio) {
            const fechaInicio = new Date(filtroFechaInicio);
            pedidosFiltrados = pedidosFiltrados.filter(pedido => {
                if (!pedido.fecha_pedido) return false;
                const fechaPedido = new Date(pedido.fecha_pedido);
                return fechaPedido >= fechaInicio;
            });
        }

        if (filtroFechaFin) {
            const fechaFin = new Date(filtroFechaFin);
            fechaFin.setHours(23, 59, 59, 999);
            pedidosFiltrados = pedidosFiltrados.filter(pedido => {
                if (!pedido.fecha_pedido) return false;
                const fechaPedido = new Date(pedido.fecha_pedido);
                return fechaPedido <= fechaFin;
            });
        }

        if (filtroEstado) {
            pedidosFiltrados = pedidosFiltrados.filter(pedido => pedido.estado === filtroEstado);
        }

        if (filtroProvincia) {
            pedidosFiltrados = pedidosFiltrados.filter(pedido => pedido.provincia === filtroProvincia);
        }

        if (filtroCiudad) {
            pedidosFiltrados = pedidosFiltrados.filter(pedido => pedido.ciudad === filtroCiudad);
        }

        return pedidosFiltrados;
    };

    const pedidosFiltrados = aplicarFiltros();
    
    // Calcular sumas por estado
    const calcularSumas = (pedidos: any[]) => {
        const ganancias = pedidos
            .filter(p => p.estado === 'En proceso' || p.estado === 'Entregado')
            .reduce((acc, p) => acc + p.total, 0);
            
        const cancelados = pedidos
            .filter(p => p.estado === 'Cancelado')
            .reduce((acc, p) => acc + p.total, 0);
            
        const totalGeneral = pedidos.reduce((acc, p) => acc + p.total, 0);
        
        return { ganancias, cancelados, totalGeneral };
    };

    const { ganancias, cancelados, totalGeneral } = calcularSumas(pedidosFiltrados);

    // Función para limpiar todos los filtros
    const limpiarTodosFiltros = () => {
        setFiltroUsuario("");
        setFiltroFechaInicio("");
        setFiltroFechaFin("");
        setFiltroEstado("");
        setFiltroProvincia("");  // Limpiar provincia
        setFiltroCiudad("");     // Limpiar ciudad
    };

    const hayFiltrosActivos = !!(filtroUsuario || filtroFechaInicio || filtroFechaFin || filtroEstado || filtroProvincia || filtroCiudad);

    const abrirModalDetalles = (pedido: any) => {
        setPedidoSeleccionado(pedido);
        setModalAbierto(true);
        setCargandoDetalles(true);
        setTimeout(() => setCargandoDetalles(false), 800);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setPedidoSeleccionado(null);
        setCargandoDetalles(false);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-600">Cargando historial de compras...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">🧾 Historial de Compras</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                    <button onClick={limpiarError} className="absolute right-2 top-2 text-red-600 hover:text-red-800 text-xl">×</button>
                </div>
            )}

            {/* Panel de Filtros */}
            <Filters
                filtroUsuario={filtroUsuario}
                setFiltroUsuario={setFiltroUsuario}
                filtroFechaInicio={filtroFechaInicio}
                setFiltroFechaInicio={setFiltroFechaInicio}
                filtroFechaFin={filtroFechaFin}
                setFiltroFechaFin={setFiltroFechaFin}
                filtroEstado={filtroEstado}
                setFiltroEstado={setFiltroEstado}
                filtroProvincia={filtroProvincia}  // Pasamos el filtro de provincia
                setFiltroProvincia={setFiltroProvincia}  // Pasamos la función para actualizar el filtro de provincia
                filtroCiudad={filtroCiudad}  // Pasamos el filtro de ciudad
                setFiltroCiudad={setFiltroCiudad}  // Pasamos la función para actualizar el filtro de ciudad
                estadosUnicos={estadosUnicos}
                provinciasUnicas={provinciasUnicas}  // Pasamos las provincias únicas
                ciudadesUnicas={ciudadesUnicas}  // Pasamos las ciudades únicas
                limpiarTodosFiltros={limpiarTodosFiltros}
                hayFiltrosActivos={hayFiltrosActivos}
            />

            {/* Resumen de resultados - Ahora con múltiples métricas */}
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
                <div className="text-center mb-4">
                    <p className="text-sm text-gray-500 mb-2">
                        {hayFiltrosActivos ? "Resultados filtrados:" : "Resumen de todas las compras:"}
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Ganancias (Procesados + Entregados) */}
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-700 mb-1">Ganancias</p>
                        <p className="text-xs text-green-600 mb-2">(En proceso + Entregado)</p>
                        <p className="text-xl font-bold text-green-600">
                            {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(ganancias)}
                        </p>
                    </div>
                    
                    {/* Cancelados */}
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm font-medium text-red-700 mb-1">Cancelados</p>
                        <p className="text-xs text-red-600 mb-2">(Pedidos cancelados)</p>
                        <p className="text-xl font-bold text-red-600">
                            {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(cancelados)}
                        </p>
                    </div>
                    
                    {/* Total General */}
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-700 mb-1">Total General</p>
                        <p className="text-xs text-blue-600 mb-2">(Todos los pedidos)</p>
                        <p className="text-xl font-bold text-blue-600">
                            {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(totalGeneral)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabla de resultados */}
            <OrderTable pedidos={pedidosFiltrados} abrirModalDetalles={abrirModalDetalles} />

            {/* Modal de Detalles del Pedido */}
            {modalAbierto && (
                <OrderDetailsModal
                    pedidoSeleccionado={pedidoSeleccionado}
                    cargandoDetalles={cargandoDetalles}
                    cerrarModal={cerrarModal}
                />
            )}
        </div>
    );
};

export default HistorialManager;