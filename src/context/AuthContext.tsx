import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, modoAdmin?: boolean) => Promise<string | null>;
  logout: () => Promise<void>;
  register: (formData: RegisterFormData) => Promise<{ error: boolean; message: string; userId?: string }>;
  authStateChanged: number;
  authError: string | null;
  setAuthError: React.Dispatch<React.SetStateAction<string | null>>;
  initialLoading: boolean;
  actionLoading: boolean;
}

interface RegisterFormData {
  name: string;
  apellido?: string; // Agregado campo apellido como opcional
  email: string;
  password: string;
  confirmPassword: string;
  telefono?: string; // Agregado campo telefono como opcional
  direccion?: string; // Agregado campo direccion como opcional
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => null,
  logout: async () => { },
  register: async () => ({ error: false, message: "", userId: "" }),
  authStateChanged: 0,
  authError: null,
  setAuthError: () => { },
  initialLoading: true,
  actionLoading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authStateChanged, setAuthStateChanged] = useState(0);

  const [mounted, setMounted] = useState(false);

  const LOAD_DELAY = 800;

  // Hook para manejar la redirección después del registro/login
  const navigate = useNavigate();

  const forceUpdateAuth = useCallback(() => {
    setAuthStateChanged((prev) => prev + 1);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const verifyUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify`, {
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

  // Efecto para manejar redirección después de autenticación exitosa
  useEffect(() => {
    if (isAuthenticated && user && !initialLoading) {
      const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
      
      if (redirectUrl) {
        console.log('🔄 Usuario autenticado, redirigiendo a:', redirectUrl);
        
        // Limpiar la URL de redirección
        sessionStorage.removeItem('redirectAfterAuth');
        
        // Redirigir con un pequeño delay para asegurar que el contexto esté completamente actualizado
        setTimeout(() => {
          navigate(redirectUrl, { replace: true });
        }, 500);
      }
    }
  }, [isAuthenticated, user, initialLoading, navigate]);

  const logout = useCallback(async () => {
    setActionLoading(true);
    setAuthError(null);
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.warn("⚠ Error durante logout (no crítico):", err);
    }
    
    // Limpiar datos de redirección y checkout al hacer logout
    sessionStorage.removeItem('redirectAfterAuth');
    sessionStorage.removeItem('checkoutFormData');
    sessionStorage.removeItem('direccionEnvio');
    
    setUser(null);
    setIsAuthenticated(false);
    forceUpdateAuth();
    setTimeout(() => setActionLoading(false), LOAD_DELAY);
  }, [forceUpdateAuth]);

  const login = useCallback(async (email: string, password: string, modoAdmin = false) => {
    setActionLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
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
        
        console.log('✅ Login exitoso para:', data.user.email);
        
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

  const register = useCallback(async (formData: RegisterFormData) => {
    console.log('📝 Iniciando proceso de registro...');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ Error en registro:', data.message);
        return { error: true, message: data.message || "Error al registrar." };
      }

      console.log('✅ Registro exitoso, iniciando sesión automática...');

      // IMPORTANTE: Después del registro exitoso, iniciar sesión automáticamente
      // para activar isAuthenticated y permitir la redirección
      try {
        const loginResult = await login(formData.email, formData.password);
        
        if (loginResult === null) {
          // Login exitoso después del registro
          console.log('✅ Sesión iniciada automáticamente después del registro');
          return { 
            error: false, 
            message: "¡Registro exitoso! Bienvenido/a.", 
            userId: data.userId 
          };
        } else {
          // Si por alguna razón el login automático falla, pero el registro fue exitoso
          console.warn('⚠ Registro exitoso pero login automático falló');
          return { 
            error: false, 
            message: "Registro exitoso. Por favor, inicia sesión.", 
            userId: data.userId 
          };
        }
      } catch (loginError) {
        console.error('❌ Error en login automático después del registro:', loginError);
        return { 
          error: false, 
          message: "Registro exitoso. Por favor, inicia sesión.", 
          userId: data.userId 
        };
      }

    } catch (error) {
      console.error('❌ Error en el proceso de registro:', error);
      return { error: true, message: "Ocurrió un error en el servidor." };
    }
  }, [login]); // Agregamos login como dependencia

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
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-[#003366]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-[#003366] text-sm font-medium">
            {actionLoading ? "Procesando..." : "Cargando..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};