import SearchForm from "../components/SearchForm/index";
import SubscriptionForm from "../components/SubscriptionForm/index";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AdsClickIcon from '@mui/icons-material/AdsClick';
import UndoIcon from '@mui/icons-material/Undo';
import Inventory2Icon from '@mui/icons-material/Inventory2';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero section with background image */}
      <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center py-8 md:py-12">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/bg.jpg"
            alt="Background"
            className="object-cover brightness-75"
          />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 w-full max-w-[1170px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <SearchForm />
            <SubscriptionForm />
          </div>
        </div>
      </div>
      <section>
        <div className="bg-[#FCF8E6] text-black p-8 flex items-center border-t-8 border-[#009EE0]">
          <div>
            <h3 className="text-xl font-bold mb-1 text-center ">
              {" "}
              <PeopleAltIcon fontSize="large" className="mr-2" /> ¿Quiénes
              somos?{" "}
            </h3>
            <p className="font-2xl mt-2 text-wrap break-words leading-relaxed" style={{ textAlign: "justify" }}>
              Toner Express es un sitio web especializado en la comercialización
              de tintas y tóners compatibles de alta calidad. Tan pronto trabaje
              con nuestros productos se dará cuenta de la ventaja de nuestros
              costos, los cuales están muy por debajo de su contraparte de
              marca. Todos nuestros pedidos se tramitan online, además contamos
              con personal calificado para procesar sus requerimientos de la
              forma más rápida y eficiente.
            </p>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Seguridad */}
        <div className="bg-[#FCF8E6] text-black p-8 flex items-center border-t-8 border-[#E74C3C]">
          
          <div>
            <h3 className="text-xl font-bold mb-1"> <SecurityIcon fontSize="large" className="mr-2" /> Seguridad</h3>
            <p className="font-2xl mt-2 text-wrap break-words leading-relaxed" style={{ textAlign: "justify" }}>
              La seguridad de su información personal es importante para
              nosotros. Seguimos los estándares de la industria generalmente
              aceptados para proteger la información personal que se nos envía,
              tanto durante la transmisión como una vez que la recibimos.
            </p>
          </div>
        </div>

        {/* VARIEDAD */}
        <div className="bg-[#FCF8E6] text-black p-8 flex items-center border-t-8 border-[#F39C12]">
          <div>
            <h3 className="text-xl font-bold mb-1"> <CheckCircleIcon fontSize="large" className="mr-2" /> Calidad</h3>
            <p className="font-2xl mt-2 text-wrap break-words leading-relaxed" style={{ textAlign: "justify"}}>
              Con Toner Express, puedes realizar la compra online de tus
              consumibles sabiendo que recibirás productos de la calidad más
              alta del mercado, además de un asesoramiento personalizado tanto
              si nos llamas por teléfono como si nos consultas por email y apoyo
              del departamento técnico para cualquier duda que te pueda surgir.
            </p>
          </div>
        </div>
      </section>

      {/* Sección de beneficios */}
      <section className="bg-[#1A1A1A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Garantía */}
            <div className="text-center">
              <h3 className="text-white text-xl font-semibold mb-4">
                GARANTIA
              </h3>
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 flex items-center justify-center border-2 border-white rounded-lg">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-white text-sm mb-4">
                Garantía 100%. Si no le gusta, lo devuelve.
              </p>
            </div>

            {/* Entrega */}
            <div className="text-center">
              <h3 className="text-white text-xl font-semibold mb-4">ENTREGA</h3>
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 flex items-center justify-center border-2 border-white rounded-lg">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-white text-sm mb-4">
                Sus pedidos son entregados a la puerta de su casa. El servicio
                es prestado por ServiEntrega.
              </p>
            </div>

            {/* Ahorro */}
            <div className="text-center">
              <h3 className="text-white text-xl font-semibold mb-4">AHORRO</h3>
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 flex items-center justify-center border-2 border-white rounded-lg">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-white text-sm mb-4">
                Compramos nuestros tóners directamente de los fabricantes en
                grandes volúmenes, por lo que tenemos las mejores ofertas para
                usted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de beneficios adicionales */}
      <section className="grid grid-cols-1 md:grid-cols-3">
        {/* CLIC & RECIBIR */}
        <div className="bg-[#FCF8E6] text-black p-8 flex items-center border-t-8 border-[#009EE0]">
          <div className="mr-4">
            <AdsClickIcon fontSize="large" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">CLIC & RECIBIR</h3>
            <p className="text-sm">
              Haz tu compra, pronto recibirás tu producto donde nos indiques
            </p>
          </div>
        </div>

        {/* DEVOLUCIONES */}
        <div className="bg-[#FCF8E6] text-black p-8 flex items-center border-t-8 border-[#E74C3C]">
          <div className="mr-4">
            <UndoIcon fontSize="large" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">DEVOLUCIONES</h3>
            <p className="text-sm">
              ¿Cambiaste de idea? No te preocupes puedes devolver el producto.
            </p>
          </div>
        </div>

        {/* VARIEDAD */}
        <div className="bg-[#FCF8E6] text-black p-8 flex items-center border-t-8 border-[#F39C12]">
          <div className="mr-4">
            <Inventory2Icon fontSize="large" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">VARIEDAD</h3>
            <p className="text-sm">
              Comprueba nuestra variedad de tóners compatibles.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-[#073056] p-8">

      </section>
    </main>
  );
}
