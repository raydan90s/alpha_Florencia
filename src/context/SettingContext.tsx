import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type Configuracion = {
    id: number;
    precio_envio: number;
    id_iva: number;
    iva: number;
};

type ConfiguracionContextType = {
    configuracion: Configuracion | null;
    loading: boolean;
    reload: () => void;
};

const ConfiguracionContext = createContext<ConfiguracionContextType>({
    configuracion: null,
    loading: true,
    reload: () => { },
});

export const useConfiguracion = () => useContext(ConfiguracionContext);

export const ConfiguracionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [configuracion, setConfiguracion] = useState<Configuracion | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchConfiguracion = async () => {
        try {
            setLoading(true);
            const url = `${import.meta.env.VITE_API_BASE_URL}/api/configuracion`;
            const res = await axios.get<Configuracion>(url);
            setConfiguracion(res.data);
        } catch (err: any) {
            console.error("Error al cargar configuración:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfiguracion();
    }, []);

    return (
        <ConfiguracionContext.Provider value={{ configuracion, loading, reload: fetchConfiguracion }}>
            {children}
        </ConfiguracionContext.Provider>
    );
};
