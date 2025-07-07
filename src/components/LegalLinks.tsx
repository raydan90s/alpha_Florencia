import { Link } from "react-router-dom";

export default function LegalLinks() {
  return (
    <div className="mt-10 text-center text-sm text-gray-500 space-x-4">
      <Link to="/politica-privacidad" className="hover:underline">
        Política de Privacidad
      </Link>
      <Link to="/contacto" className="hover:underline">
        Contacto
      </Link>
      <Link to="/envio-entrega" className="hover:underline">
        Envío y Entrega
      </Link>
      <Link to="/terminos-condiciones" className="hover:underline">
        Términos y Condiciones
      </Link>
    </div>
  );
}
