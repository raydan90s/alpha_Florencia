const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start px-6">
        {/* Logo y Contacto */}
        <div className="md:w-1/4 mb-6 md:mb-0 ">
          <img
            src="/images/logo/logo_footer.png"
            alt="Toner Express"
            width={160}
            height={40}
            className="mb-4 border-b-2 border-[#F98406]"
          />
          <p className="flex items-center gap-2">
            <img src="/images/footer/store.png" alt="store icon" width={20} height={20} />
            Somos tienda en línea
          </p>
          <p className="flex items-center gap-2 pt-2">
            <img src="/images/footer/phone.png" alt="phone icon" width={20} height={20} />
            +593 96 585 256
          </p>
          <p className="flex items-center gap-2 pt-2">
            <img src="/images/footer/mail.png" alt="mail icon" width={20} height={20} />
            info@tonerexpress-ec.com
          </p>
          {/* Redes Sociales */}
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-white text-2xl">
              <img src="/images/social/fb.png" alt="Facebook" width={32} height={32} />
            </a>
            <a href="#" className="text-white text-2xl">
              <img src="/images/social/ig.png" alt="Instagram" width={32} height={32} />
            </a>
            <a href="#" className="text-white text-2xl">
              <img src="/images/social/tt.png" alt="TikTok" width={32} height={32} />
            </a>
          </div>
        </div>

        {/* Links de Información */}
        <div className="md:w-1/4 mb-6 md:mb-0">
          <h3 className="text-[#F98406] font-bold mb-2 border-b-2 border-[#F98406]">INFORMACIÓN</h3>
          <ul>
            <li><a href="#">INICIO</a></li>
            <li><a href="#">QUIÉNES SOMOS</a></li>
            <li><a href="#">PRODUCTOS</a></li>
            <li><a href="#">CONTÁCTENOS</a></li>
          </ul>
        </div>

        {/* Soporte */}
        <div className="md:w-1/4 mb-6 md:mb-0">
          <h3 className="text-[#F98406] font-bold mb-2 border-b-2 border-[#F98406]">SOPORTE</h3>
          <ul>
            <li><a href="#">PROCESO DE COMPRAS</a></li>
            <li><a href="#">PROCESO DE REGISTRO</a></li>
            <li><a href="#">NOTICIAS</a></li>
          </ul>
        </div>

        {/* Marcas Compatibles */}
        <div className="md:w-1/4">
          <h3 className="text-[#F98406] font-bold mb-2 border-b-2 border-[#F98406]">MARCAS COMPATIBLES</h3>
          <p>EPSON, HP, CANON, BROTHER, KYOCERA</p>
          <img
            src="/images/logo/KIOT_logo_blanco.png"
            alt="KIOT"
            width={160}
            height={40}
            className="mt-4"
          />
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-orange-500 text-center py-2 mt-6">
        <p>Copyright © 2025 Toner Express - All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;

