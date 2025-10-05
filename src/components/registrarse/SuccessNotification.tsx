interface SuccessNotificationProps {
  show: boolean;
}

export default function SuccessNotification({ show }: SuccessNotificationProps) {
  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-lg max-w-md">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 text-green-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-semibold">Enviando correo de verificación...</p>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Procesando...</span>
        </div>
      </div>
    </div>
  );
}