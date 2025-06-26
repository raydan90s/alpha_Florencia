import { useState, useRef, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // React Router para rutas y navegación
import { AuthContext } from "../context/AuthContext"; // Ajusta la ruta según tu estructura
import LegalLinks from "../components/LegalLinks";

export default function IniciarSesion() {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    recordar: false,
  });
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { login, authError, actionLoading, setAuthError } = useContext(AuthContext);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => {
        setAuthError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [authError, setAuthError]);

  if (!isClient) return <p>Cargando...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const loginError = await login(formData.email, formData.password);
    if (loginError) {
      setFormData((prev) => ({ ...prev, password: "" }));
      passwordInputRef.current?.focus();
      return;
    }
    setAuthError(null);
    navigate("/productos"); // Navegar con react-router
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-md w-full mx-auto space-y-8 flex-1">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar sesión</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link to="/registrarse" className="font-medium text-[#003366] hover:text-[#004488]">
              Regístrate
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                ref={passwordInputRef}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="recordar"
                name="recordar"
                type="checkbox"
                className="h-4 w-4 text-[#003366] focus:ring-[#003366] border-gray-300 rounded"
                checked={formData.recordar}
                onChange={handleChange}
              />
              <label htmlFor="recordar" className="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <Link to="/recuperar-password" className="font-medium text-[#003366] hover:text-[#004488]">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF6B00] hover:bg-[#FF8533] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366] ${
                actionLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={actionLoading}
            >
              {actionLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </div>

          {authError && <p className="text-red-600 text-center text-sm mt-2">{authError}</p>}
        </form>

        <div className="pt-4">
          <LegalLinks />
        </div>
      </div>

      <footer className="mt-6 text-center text-sm text-gray-500">
        © 2025 Toner Express · Todos los derechos reservados
      </footer>
    </div>
  );
}
