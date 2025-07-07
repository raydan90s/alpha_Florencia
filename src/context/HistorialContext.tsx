"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

export interface ResumenPedido {
  id_pedido: number; // 👈 agrega esto
  id: number;
  nombre_usuario: string;
  fecha_pedido: string;
  total: number;
  estado: string;
}

interface HistorialContextType {
  pedidos: ResumenPedido[];
  loading: boolean;
  error: string | null;
  obtenerPedidos: () => Promise<void>;
  limpiarError: () => void;
  filtrarPorUsuario: (nombre: string) => ResumenPedido[];
  filtrarPorEstado: (estado: string) => ResumenPedido[];
  obtenerTotalGeneral: () => number;
}

const HistorialContext = createContext<HistorialContextType>({
  pedidos: [],
  loading: true,
  error: null,
  obtenerPedidos: async () => { },
  limpiarError: () => { },
  filtrarPorUsuario: () => [],
  filtrarPorEstado: () => [],
  obtenerTotalGeneral: () => 0,
});

export const useHistorial = () => useContext(HistorialContext);

interface HistorialProviderProps {
  children: ReactNode;
}

export const HistorialProvider: React.FC<HistorialProviderProps> = ({
  children,
}) => {
  const [pedidos, setPedidos] = useState<ResumenPedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const obtenerPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/historial-pedidos`;
      const res = await axios.get<ResumenPedido[]>(url);
      setPedidos(res.data);
    } catch (err: any) {
      console.error("❌ Error al obtener pedidos:", err);
      setError(err.message || "Error desconocido al obtener pedidos");
    } finally {
      setLoading(false);
    }
  };

  const limpiarError = () => {
    setError(null);
  };

  const filtrarPorUsuario = (nombre: string): ResumenPedido[] => {
    if (!nombre.trim()) {
      return pedidos;
    }
    const filtrados = pedidos.filter((p) =>
      p.nombre_usuario.toLowerCase().includes(nombre.toLowerCase())
    );
    return filtrados;
  };

  const filtrarPorEstado = (estado: string): ResumenPedido[] => {
    if (!estado.trim()) {
      return pedidos;
    }
    const filtrados = pedidos.filter(
      (p) => p.estado.toLowerCase() === estado.toLowerCase()
    );
    return filtrados;
  };

  const obtenerTotalGeneral = (): number => {
    const total = pedidos.reduce((acc, p) => acc + p.total, 0);
    return total;
  };

  useEffect(() => {
    obtenerPedidos();
  }, []);

  return (
    <HistorialContext.Provider
      value={{
        pedidos,
        loading,
        error,
        obtenerPedidos,
        limpiarError,
        filtrarPorUsuario,
        filtrarPorEstado,
        obtenerTotalGeneral,
      }}
    >
      {children}
    </HistorialContext.Provider>
  );
};
