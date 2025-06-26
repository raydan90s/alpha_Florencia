import { createContext, useState, useEffect, useCallback, useMemo } from 'react';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, modoAdmin?: boolean) => Promise<string | null>;
  logout: () => Promise<void>;
  register: (formData: any) => Promise<{ error: boolean; message: string; userId?: string }>;
  authStateChanged: number;
  authError: string | null;
  setAuthError: React.Dispatch<React.SetStateAction<string | null>>;
  initialLoading: boolean;
  actionLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => null,
  logout: async () => {},
  register: async () => ({ error: false, message: "", userId: "" }),
  authStateChanged: 0,
  authError: null,
  setAuthError: () => {},
  initialLoading: true,
  actionLoading: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authStateChanged, setAuthStateChanged] = useState(0);

  const [mounted, setMounted] = useState(false);

  const LOAD_DELAY = 800;

  const forceUpdateAuth = useCallback(() => {
    setAuthStateChanged((prev) => prev + 1);
  }, []);

  // Solo activa mounted en cliente (evita fetch en SSR o build time)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // no hacer fetch si no estamos en cliente

    const verifyUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (res.ok && data.user && data.user.nombre) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("⚠ Error verificando sesión:", err);
        setUser(null);
        setIsAuthenticated(false);
      }
      setInitialLoading(false);
    };

    verifyUser();
  }, [authStateChanged, mounted]);

  const logout = useCallback(async () => {
    setActionLoading(true);
    setAuthError(null);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.warn("⚠ Error durante logout (no crítico):", err);
    }
    setUser(null);
    setIsAuthenticated(false);
    forceUpdateAuth();
    setTimeout(() => setActionLoading(false), LOAD_DELAY);
  }, [forceUpdateAuth]);

  const login = useCallback(async (email, password, modoAdmin = false) => {
    setActionLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        if (modoAdmin && data.user.tipo !== 'Admin') {
          const errorMsg = 'Acceso restringido a administradores.';
          setAuthError(errorMsg);
          return errorMsg;
        }

        setUser(data.user);
        setIsAuthenticated(true);
        forceUpdateAuth();
        return null;
      } else {
        const errorMsg = data.error || 'Credenciales inválidas.';
        setAuthError(errorMsg);
        return errorMsg;
      }
    } catch (err) {
      const errorMsg = 'Error de conexión.';
      console.error("🌐 Error de red:", err);
      setAuthError(errorMsg);
      return errorMsg;
    } finally {
      setTimeout(() => setActionLoading(false), 1000);
    }
  }, [forceUpdateAuth]);

  const register = useCallback(async (formData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: true, message: data.message || "Error al registrar." };
      }

      return { error: false, message: data.message, userId: data.userId };
    } catch (error) {
      return { error: true, message: "Ocurrió un error en el servidor." };
    }
  }, []);

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    login,
    logout,
    register,
    authStateChanged,
    authError,
    setAuthError,
    initialLoading,
    actionLoading,
  }), [
    user,
    isAuthenticated,
    login,
    logout,
    register,
    authStateChanged,
    authError,
    initialLoading,
    actionLoading,
  ]);

  if (!mounted) {
    return <>{children}</>;
  }

  if (initialLoading || actionLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <svg className="animate-spin h-10 w-10 text-[#003366]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
