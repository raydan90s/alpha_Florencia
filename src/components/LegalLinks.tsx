import Link from "next/link";

export default function LegalLinks() {
  return (
    <div className="mt-10 text-center text-sm text-gray-500 space-x-4">
      <Link href="/politica-privacidad" className="hover:underline">Política de Privacidad</Link>
      <Link href="/contacto" className="hover:underline">Contacto</Link>
      <Link href="/envio-entrega" className="hover:underline">Envío y Entrega</Link>
      <Link href="/terminos-condiciones" className="hover:underline">Términos y Condiciones</Link>
    </div>
  );
}