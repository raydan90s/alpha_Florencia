// components/Checkout/AuthenticationNotice.tsx
interface AuthenticationNoticeProps {
  isAuthenticated: boolean;
}

const AuthenticationNotice = ({ isAuthenticated }: AuthenticationNoticeProps) => {
  if (isAuthenticated) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 text-yellow-600 mt-0.5">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h4 className="font-medium text-yellow-800 mb-1">
            Registro requerido
          </h4>
          <p className="text-sm text-yellow-700">
            Necesitarás registrar una cuenta para completar tu compra. Tus datos se guardarán automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationNotice;