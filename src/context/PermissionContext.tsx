import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext"; // ajusta según tu estructura

type Permissions = string[];

interface PermissionContextType {
  permissions: Permissions;
  setPermissions: (p: Permissions) => void;
}

export const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);
  const [permissions, setPermissions] = useState<Permissions>([]);

  useEffect(() => {
    async function fetchPermissions() {
      if (!user) {
        setPermissions([]);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/permissions/${user.id}`);
        if (!res.ok) throw new Error("No se pudo cargar los permisos");
        const data = await res.json();

        setPermissions(data.permisos);
      } catch (error) {
        console.error(error);
        setPermissions([]);
      }
    }

    fetchPermissions();
  }, [user]);

  return (
    <PermissionContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) throw new Error("usePermissions debe usarse dentro de PermissionProvider");
  return context;
};

