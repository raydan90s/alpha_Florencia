interface AccountHeaderProps {
  title?: string; // ahora opcional
  subtitle?: string;
  user?: { nombre?: string; email?: string }; // opcional si quieres usarlo
  showBackButton?: boolean;
  onBack?: () => void;
}

const AccountHeader = ({ title, subtitle, showBackButton, onBack }: AccountHeaderProps) => {
  return (
    <div className="mb-8">
      {showBackButton && onBack && (
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          ← Volver a Mi Cuenta
        </button>
      )}
      {title && <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>}
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default AccountHeader;
