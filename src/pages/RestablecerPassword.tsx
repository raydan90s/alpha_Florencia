import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface ActualizarPasswordResponse {
  message: string;
}

export default function RestablecerPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post<ActualizarPasswordResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/api/actualizar-contrasena`,
        {
          token,
          nuevaPassword: password
        },
        {
          withCredentials: true, // si necesitas enviar cookies
          headers: {
            'X-API-Key': import.meta.env.VITE_API_KEY
          }
        }
      );
      setMessage(res.data.message || "Contraseña actualizada exitosamente.");
      setTimeout(() => navigate("/iniciar-sesion"), 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p>Token inválido o ausente.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Restablecer contraseña</h2>
        {message && <p className="text-center text-red-600 mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#FF6B00] text-white rounded hover:bg-[#FF8533]"
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
