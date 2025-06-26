import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Vite usa react-router
import { AuthContext } from "../../context/AuthContext"; // Ajusta si la ruta cambia

export default function AdminLogin() {
  const navigate = useNavigate();
  const {
    login,
    authError,
    isAuthenticated,
    user,
    setAuthError,
  } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!user || !isAuthenticated) return;

    if (user.tipo === "Admin" || user.tipo === "SuperAdmin") {
      navigate("/admin/dashboard"); // navegación con react-router
    } else {
      setLocalError("Acceso denegado. Se requieren credenciales de administrador.");
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError("");
    setAuthError(null);

    const loginResult = await login(credentials.email, credentials.password, true);

    if (isMounted.current) {
      setIsLoading(false);
      if (loginResult === null) {
        // Éxito: el redireccionamiento ocurre en useEffect
      } else {
        setLocalError(loginResult); // Mensaje de error si no fue exitoso
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Panel de Administración
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Acceso exclusivo para administradores
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {(authError || localError) && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {authError || localError}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#003366] hover:bg-[#004488] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366]"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
