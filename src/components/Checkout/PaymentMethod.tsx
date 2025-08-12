import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";

interface PaymentMethodProps {
  selectedMethod: string; // método actual seleccionado (lo controla el padre)
  onMethodChange: (method: string) => void; // función para cambiarlo
}

const MetodoPago: React.FC<PaymentMethodProps> = ({ selectedMethod, onMethodChange }) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Método de Pago</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">

          {/* Tarjeta de crédito o débito */}
          <label
            htmlFor="tarjeta"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio" // ✅ Mejor radio para selección única
                name="metodoPago"
                id="tarjeta"
                className="sr-only"
                checked={selectedMethod === "tarjeta"}
                onChange={() => onMethodChange("tarjeta")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selectedMethod === "tarjeta"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${
                selectedMethod === "tarjeta"
                  ? "border-transparent bg-gray-2"
                  : "border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="flex gap-3 pr-2.5 text-[28px]">
                  <FaCcVisa title="Visa" className="text-[#1a1f71]" />
                  <FaCcMastercard title="MasterCard" className="text-[#eb001b]" />
                  <FaCcAmex title="American Express" className="text-[#2e77bc]" />
                </div>
                <div className="border-l border-gray-4 pl-2.5">
                  <p>Tarjeta de crédito o débito</p>
                </div>
              </div>
            </div>
          </label>

        </div>
      </div>
    </div>
  );
};

export default MetodoPago;
