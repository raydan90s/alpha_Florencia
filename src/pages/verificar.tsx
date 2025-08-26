import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface VerificationResult {
  verified: boolean;
  message: string;
  alreadyVerified?: boolean;
}

interface ApiVerificationResponse {
  message: string;
  verified: boolean;
  alreadyVerified?: boolean;
}

export default function VerificarEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setResult({ verified: false, message: 'Token de verificación no válido.' });
      setLoading(false);
      return;
    }

    const verificarEmail = async () => {
      try {
        const response = await axios.get<ApiVerificationResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/api/verificar-email/${token}`, {
          headers: {
            'X-API-Key': import.meta.env.VITE_API_KEY,
          },
        });
        setResult({
          verified: response.data.verified,
          message: response.data.message,
          alreadyVerified: response.data.alreadyVerified
        });
      } catch (error: any) {
        console.error('❌ API Error:', error);
        const errorMessage = error.response?.data?.message || 'Error al verificar el correo electrónico.';
        setResult({ verified: false, message: errorMessage });
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      verificarEmail();
    }, 3000); // 3 segundos de espera

    // Limpieza del timeout si el componente se desmonta
    return () => clearTimeout(timeoutId);

  }, [token]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Verificando correo...</h2>
          <p className="text-gray-600 mt-2">Por favor espera un momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center">
          {result?.verified ? (
            <>
              {/* Verificación exitosa */}
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {result.alreadyVerified ? '¡Ya estás verificado!' : '¡Correo verificado!'}
              </h2>

              <p className="text-gray-600 mb-8">{result.message}</p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-green-600 mt-1">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-green-800 text-sm mb-2">¡Cuenta activada!</h4>
                    <p className="text-sm text-green-700">
                      Tu cuenta ha sido verificada exitosamente. Ahora puedes iniciar sesión y acceder a todas las funciones.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/iniciar-sesion')}
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#FF6B00] hover:bg-[#FF8533] transition-colors"
                >
                  Iniciar sesión
                </button>

                <Link
                  to="/"
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Ir al inicio
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">Error de verificación</h2>

              <p className="text-gray-600 mb-8">{result?.message}</p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-red-600 mt-1">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.734 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-red-800 text-sm mb-2">Posibles causas:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• El enlace ya fue utilizado</li>
                      <li>• El enlace ha expirado</li>
                      <li>• El enlace está dañado o incompleto</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/iniciar-sesion"
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#FF6B00] hover:bg-[#FF8533] transition-colors"
                >
                  Intentar iniciar sesión
                </Link>

                <Link
                  to="/registro"
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Crear nueva cuenta
                </Link>

                <Link
                  to="/"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Volver al inicio
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
