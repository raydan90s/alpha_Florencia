import { Link } from "react-router-dom";

export default function AlreadyRegisteredScreen() {
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