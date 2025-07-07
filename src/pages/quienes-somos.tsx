
export default function QuienesSomos() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8E6]">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px]">
        <img
          src="/images/hero/office_who.jpg"
          alt="Quiénes Somos"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            ¿Quiénes Somos?
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 ">
        <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Quienes Somos Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Quienes somos
            </h2>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Un equipo experimentado a sus órdenes
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4" style={{ textAlign: "justify" }}>
              Toner Express es un sitio web especializado en la venta y distribución de tóner
              compatible de alta calidad. Tan pronto trabaje con nuestros productos se dará cuenta
              de la ventaja de nuestros costos, los cuales están muy por debajo de su contraparte
              de marca.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4" style={{ textAlign: "justify" }}>
              Todos nuestros pedidos se tramitan online, además contamos con personal
              calificado para procesar sus requerimientos de la forma más rápida y eficiente.
            </p>
            <p className="text-gray-600 leading-relaxed" style={{ textAlign: "justify" }}>
              Si está considerando hacer un cambio a tóner de impresora barato, nosotros somos
              su mejor opción.
            </p>
            <div className="mt-6">
              <p className="text-gray-700 font-medium">
                Contáctenos. Nos encantaría comunicarnos con Ud.
              </p>
            </div>
          </div>

          {/* Lo que hacemos Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Lo que hacemos
            </h2>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Productos de calidad, confiables y económicos.
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4" style={{ textAlign: "justify" }}>
              En Toner Express vendemos cartuchos de toner compatible nuevos, no
              remanufacturados, de esta forma podemos ofrecerle un precio realmente
              competitivo al mismo tiempo que ofrecemos productos con una calidad igual o
              superior a la de los originales, ya que nos hemos preocupado de que nuestros
              productos, no sólo cumplan los mismos estándares de calidad, sino incluso de
              mejorarlos.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4" style={{ textAlign: "justify" }}>
              El toner compatible de Toner Express, es un tipo de toner diseñado para ser utilizado
              en tu impresora. Tiene el mismo tamaño y forma, y contiene tintas de primera
              calidad por lo que no tendrás problema con ellos.
            </p>
            <div className="mt-6">
              <p className="text-xl font-semibold text-blue-600">
                ¿Quiere probarlo? ¡Compra nuestros productos!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 