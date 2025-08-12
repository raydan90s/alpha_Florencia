import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

// Hook para manejar redirección después del registro
const useAuthRedirect = (isAuthenticated: boolean) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Verificar si hay una URL de redirección guardada
      const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
      
      if (redirectUrl) {
        console.log('🔄 Redirigiendo después del registro exitoso a:', redirectUrl);
        
        // Limpiar la URL de redirección
        sessionStorage.removeItem('redirectAfterAuth');
        
        // Redirigir con un pequeño delay para asegurar que el contexto esté actualizado
        setTimeout(() => {
          navigate(redirectUrl, { replace: true });
        }, 500); // Un poco más de tiempo para mostrar mensaje de éxito
      }
    }
  }, [isAuthenticated, navigate]);
};

export default function Registro() {
  // Definimos la interfaz RegisterFormData dentro del componente
  interface RegisterFormData {
    name: string;
    apellido: string;
    email: string;
    password: string;
    confirmPassword: string;
    telefono: string;
    direccion: string;
  }

  const { register, authError, setAuthError, user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Hook para manejar redirección automática después del registro
  useAuthRedirect(isAuthenticated);

  // Estado para controlar si el componente ya está montado (cliente)
  const [mounted, setMounted] = useState(false);

  // Verificar si viene del checkout
  const isFromCheckout = sessionStorage.getItem('redirectAfterAuth') === '/checkout';

  // Limpia errores al montar el componente y marca como montado
  useEffect(() => {
    setMounted(true);
    setAuthError(null);
  }, [setAuthError]);

  // Estado del formulario
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    direccion: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!mounted) {
    return <p>Cargando...</p>;
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Ya tienes una cuenta!
          </h2>
          <p className="text-gray-600 mb-6">
            Ya estás registrado y con sesión iniciada.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF6B00] hover:bg-[#FF8533]"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess(false);
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);

      if (!result.error) {
        setSuccess(true);
        
        // Mensaje personalizado según si viene del checkout o no
        const message = isFromCheckout 
          ? "¡Registro exitoso! Te redirigiremos al checkout para completar tu compra..."
          : result.message || "¡Registro exitoso! Te redirigiremos al inicio de sesión...";
        
        setSuccessMessage(message);
        setError("");

        // Si viene del checkout, el hook useAuthRedirect manejará la redirección automática
        // Si no viene del checkout, redirigir al login como antes
        if (!isFromCheckout) {
          setTimeout(() => {
            navigate("/iniciar-sesion");
          }, 3000);
        }
        // Si viene del checkout, el useAuthRedirect se encargará de la redirección
      } else {
        setError(result.message || "Error al registrarse");
        setSuccess(false);
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
      setSuccess(false);
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccessMessage("");
  };

  return (
    <>
      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 text-green-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold">{successMessage}</p>
            </div>
            {isFromCheckout && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Redirigiendo...</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Crear una cuenta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/iniciar-sesion"
                className="font-medium text-[#003366] hover:text-[#004488]"
              >
                Inicia sesión
              </Link>
            </p>
            
            {/* Indicador si viene del checkout */}
            {isFromCheckout && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-blue-600 mt-0.5">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 text-sm">
                      Completar compra
                    </h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Después del registro regresarás automáticamente al checkout con tus datos guardados.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="apellido"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
                    value={formData.apellido}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo electrónico <span className="text-red-500">*</span>
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmar contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="text-center mt-4">
              {formError && <p className="text-red-600 text-sm">{formError}</p>}
              {authError && <p className="text-red-600 text-sm">{authError}</p>}
              {loading && (
                <div className="flex justify-center items-center gap-2 mt-2">
                  <svg
                    className="animate-spin h-5 w-5 text-[#003366]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span className="text-[#003366] text-sm">
                    {isFromCheckout ? "Registrando y preparando checkout..." : "Registrando..."}
                  </span>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF6B00] hover:bg-[#FF8533]"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366]`}
              >
                {loading 
                  ? (isFromCheckout ? "Registrando..." : "Registrando...") 
                  : (isFromCheckout ? "Registrarse y continuar compra" : "Registrarse")
                }
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-4">
                <p className="text-red-600 text-center text-sm">{error}</p>
              </div>
            )}
          </form>

          {/* Información adicional para usuarios que vienen del checkout */}
          {isFromCheckout && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Al registrarte, podrás completar tu compra de forma más rápida y segura.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}