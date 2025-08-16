import { useCart } from "../../context/CartContext";
import { useConfiguracion } from "../../context/SettingContext";

const OrderList = () => {
  const { cartItems, calcularIVAEnvio, calcularSubtotalEnvio, calcularTotalEnvio } = useCart();
  const { configuracion } = useConfiguracion();

  const costoEnvio = configuracion?.precio_envio ?? 0;
  const subtotal = calcularSubtotalEnvio();
  const iva = calcularIVAEnvio();
  const totalConIva = calcularTotalEnvio();

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Tu Pedido</h3>
      </div>

      <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
        <div className="grid grid-cols-3 gap-4 py-5 border-b border-gray-3 bg-gray-100 rounded-md">
          <h4 className="font-semibold text-dark">Producto</h4>
          <h4 className="font-semibold text-dark text-center">Cantidad</h4>
          <h4 className="font-semibold text-dark text-right">Subtotal</h4>
        </div>

        {cartItems.map((item) => (
          <div key={item.id} className="grid grid-cols-3 gap-4 py-4 border-b border-gray-100">
            <p className="text-dark">{item.nombre}</p>
            <p className="text-center text-dark">{item.cantidad}</p>
            <p className="text-dark text-right">${(item.precio * item.cantidad).toFixed(2)}</p>
          </div>
        ))}

        <div className="mt-5 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Costo de Envío</p>
            <p className="text-gray-800 font-medium">${costoEnvio.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Subtotal</p>
            <p className="text-gray-800 font-medium">${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">IVA (15%)</p>
            <p className="text-gray-800 font-medium">${iva.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center justify-between border-t border-gray-300 pt-4 mt-4">
            <p className="text-lg font-semibold text-dark">Total a pagar</p>
            <p className="text-lg font-bold text-blue">${Number(totalConIva.toFixed(2))}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
