import { Link } from "react-router-dom";

interface VerificationSuccessScreenProps {
  userEmail: string;
  isFromCheckout: boolean;
  onRegisterAnother: () => void;
}

export default function VerificationSuccessScreen({ 
  userEmail, 
  isFromCheckout, 
  onRegisterAnother 
}: VerificationSuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Registro exitoso!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Hemos enviado un correo de verificación a <strong>{userEmail}</strong>
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-blue-600 mt-1">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-medium text-blue-800 text-sm mb-2">
                  Pasos siguientes:
                </h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Revisa tu bandeja de entrada y carpeta de spam</li>
                  <li>2. Haz clic en el enlace de verificación</li>
                  <li>3. Regresa para iniciar sesión</li>
                </ol>
              </div>
            </div>
          </div>

          {isFromCheckout && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-yellow-600 mt-0.5">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.734 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-yellow-800 text-sm">
                    Checkout pendiente
                  </h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    Una vez verificada tu cuenta, podrás iniciar sesión y completar tu compra.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link
              to="/iniciar-sesion"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF6B00] hover:bg-[#FF8533] transition-colors"
            >
              Ir a iniciar sesión
            </Link>
            
            <button
              onClick={onRegisterAnother}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Registrar otra cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}