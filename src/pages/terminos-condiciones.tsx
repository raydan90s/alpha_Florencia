
const TerminosCondiciones = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto  rounded-2xl  p-10">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">
          TÉRMINOS Y CONDICIONES DE USO – TONER EXPRESS
        </h1>

        <p className="text-gray-700 mb-8 text-lg leading-relaxed">
          Bienvenido a Toner Express. Al acceder y utilizar este sitio web para adquirir productos,
          usted acepta los presentes Términos y Condiciones. Le recomendamos leerlos detenidamente
          antes de realizar una compra. Al completar una transacción, usted declara haber leído y
          aceptado estos términos.
        </p>

        {[
          {
            title: '1. REGISTRO DEL USUARIO',
            content:
              'Para adquirir productos en nuestro sitio web puede ser necesario registrarse proporcionando información personal verídica. El usuario es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta.',
          },
          {
            title: '2. PRODUCTOS Y DISPONIBILIDAD',
            content:
              'Todos los productos ofrecidos en este sitio están sujetos a disponibilidad de inventario. Nos reservamos el derecho de modificar o descontinuar productos sin previo aviso. Las imágenes son referenciales y pueden presentar ligeras variaciones respecto al producto final.',
          },
          {
            title: '3. PRECIOS',
            content:
              'Los precios publicados en nuestro sitio aplican exclusivamente para compras realizadas en línea. Nos reservamos el derecho de modificar los precios en cualquier momento y sin previo aviso.',
          },
        ].map((section, idx) => (
          <section key={idx} className="mb-8">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-2">{section.title}</h2>
            <p className="text-gray-700 leading-relaxed">{section.content}</p>
          </section>
        ))}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-2">4. ENVÍOS</h2>
          <p className="text-gray-700 leading-relaxed">
            Todos los envíos se realizan exclusivamente a través de{' '}
            <strong>Servientrega</strong>. El cliente es responsable de proporcionar correctamente
            la dirección de envío. El plazo de entrega comienza a contarse una vez que se confirma
            el pago.
          </p>
          <p className="text-gray-700 mt-2 leading-relaxed">
            En caso de ausencia del cliente en el domicilio, Servientrega dejará un aviso. Si no se
            concreta la entrega, el pedido será devuelto a Toner Express, y el cliente deberá asumir
            el costo de un nuevo envío.
          </p>
          <p className="text-gray-700 mt-2 leading-relaxed">
            Toner Express <strong>no realiza entregas personales</strong> ni por otros medios fuera
            del convenio con Servientrega.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
            5. POLÍTICA DE CAMBIOS, DEVOLUCIONES Y REEMBOLSOS
          </h2>
          <p className="text-gray-700 leading-relaxed">
            En <strong>Toner Express no se aceptan devoluciones, reembolsos ni cambios</strong> bajo
            ninguna circunstancia. Todos los productos ofrecidos son tintas y tóners nuevos,
            revisados antes del envío.
          </p>
          <p className="text-gray-700 mt-2 leading-relaxed">
            Le solicitamos al cliente verificar cuidadosamente la compatibilidad del producto antes
            de concretar su compra.
          </p>
          <p className="text-gray-700 mt-2 leading-relaxed font-semibold">
            Una vez realizada la compra, no se admitirán solicitudes de cambio, retracto o
            reembolso.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
            6. RESPONSABILIDAD DEL CLIENTE
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>La compatibilidad del producto con su impresora.</li>
            <li>La dirección y datos de contacto al momento de hacer la compra.</li>
          </ul>
          <p className="mt-2 text-gray-700 leading-relaxed">
            No nos hacemos responsables por errores cometidos por el cliente en el proceso de
            compra.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-2">7. PRIVACIDAD</h2>
          <p className="text-gray-700 leading-relaxed">
            Toner Express garantiza la confidencialidad de los datos personales proporcionados.
            Estos no serán compartidos con terceros, salvo requerimiento legal o judicial.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-indigo-600 mb-2">8. MODIFICACIONES</h2>
          <p className="text-gray-700 leading-relaxed">
            Toner Express se reserva el derecho de actualizar o modificar estos Términos y
            Condiciones en cualquier momento y sin previo aviso. Le recomendamos revisarlos
            periódicamente.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TerminosCondiciones;
