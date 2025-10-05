interface AccountErrorProps {
  title?: string;
  message?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const AccountError = ({ 
  title = "Acceso requerido",
  message = "Por favor inicia sesión para acceder a tu cuenta.",
  icon = "🔐",
  actionLabel,
  onAction
}: AccountErrorProps) => {
  return (
    <div className="max-w-4xl mx-auto p-5 text-center min-h-[400px] flex items-center justify-center">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountError;