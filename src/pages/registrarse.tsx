import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // react-router-dom para navegación

export default function Registro() {
  // Definimos la interfaz RegisterFormData dentro del componente
  interface RegisterFormData {
    name: string;
    apellido: string; // Agregado 'apellido'
    email: string;
    password: string;
    confirmPassword: string;
    telefono: string;
    direccion: string;
  }

  const { register, authError, setAuthError, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado para controlar si el componente ya está montado (cliente)
  const [mounted, setMounted] = useState(false);

  // Limpia errores al montar el componente y marca como montado
  useEffect(() => {
    setMounted(true);
    setAuthError(null);
  }, [setAuthError]);

  // Estado del formulario
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "", // Cambiado de 'nombre' a 'name'
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "", // Cambiado de 'confirmarPassword' a 'confirmPassword'
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
    return <p>Ya estás registrado y logueado.</p>;
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
        confirmPassword: "", // Cambiado de 'confirmarPassword' a 'confirmPassword'
      }));
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);

      if (!result.error) {
        setSuccess(true);
        setSuccessMessage(result.message);
        setError("");

        setTimeout(() => {
          navigate("/iniciar-sesion");
        }, 3000);
      } else {
        setError(result.message || "Error al registrarse");
        setSuccess(false);
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "", // Cambiado de 'confirmarPassword' a 'confirmPassword'
        }));
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
      setSuccess(false);
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "", // Cambiado de 'confirmarPassword' a 'confirmPassword'
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
        <p className="pt-8 text-lg font-semibold text-green-700 text-center">
          {successMessage}
        </p>
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
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre
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
                    Apellido
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmar contraseña
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
                <div className="flex justify-center mt-2">
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
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? "bg-gray-400" : "bg-[#FF6B00] hover:bg-[#FF8533]"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366]`}
              >
                {loading ? "Registrando..." : "Registrarse"}
              </button>
            </div>

            {error && (
              <p className="text-red-600 text-center text-sm mt-2">{error}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
