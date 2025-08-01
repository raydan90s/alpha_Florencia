import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react'; // Importar ReactNode como un tipo


interface DireccionEnvioContextType {
  direccionEnvio: any;
  setDireccionEnvio: React.Dispatch<React.SetStateAction<any>>;
}

// Creamos el contexto
const DireccionEnvioContext = createContext<DireccionEnvioContextType | undefined>(undefined);

// Hook para usar el contexto
export const useDireccionEnvio = () => {
  const context = useContext(DireccionEnvioContext);
  if (!context) {
    throw new Error('useDireccionEnvio must be used within a DireccionEnvioProvider');
  }
  return context;
};

// Definimos el tipo para las props de DireccionEnvioProvider
interface DireccionEnvioProviderProps {
  children: ReactNode;  // Especificamos que 'children' puede ser cualquier nodo de React
}

// Proveedor del contexto
export const DireccionEnvioProvider: React.FC<DireccionEnvioProviderProps> = ({ children }) => {
  const [direccionEnvio, setDireccionEnvio] = useState<any>(null);

  return (
    <DireccionEnvioContext.Provider value={{ direccionEnvio, setDireccionEnvio }}>
      {children}
    </DireccionEnvioContext.Provider>
  );
};
