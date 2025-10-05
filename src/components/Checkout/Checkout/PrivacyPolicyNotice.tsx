// components/Checkout/PrivacyPolicyNotice.tsx
const PrivacyPolicyNotice = () => {
  return (
    <div className="text-xs text-gray-600">
      Tus datos personales serán utilizados para procesar tu compra, optimizar tu experiencia en este sitio y administrar el acceso a tu cuenta. Consulta nuestra{" "}
      <a href="/politica-privacidad" target="_blank" className="text-blue-600 underline">
        política de privacidad
      </a>.
    </div>
  );
};

export default PrivacyPolicyNotice;