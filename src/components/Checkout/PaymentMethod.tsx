import React, { useState } from "react";
import Image from "next/image";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";


const MetodoPago = () => {
  const [metodoPago, setMetodoPago] = useState("transferencia");

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
                type="checkbox"
                name="tarjeta"
                id="tarjeta"
                className="sr-only"
                onChange={() => setMetodoPago("tarjeta")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${metodoPago === "tarjeta"
                  ? "border-4 border-blue"
                  : "border border-gray-4"
                  }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${metodoPago === "tarjeta"
                ? "border-transparent bg-gray-2"
                : " border-gray-4 shadow-1"
                }`}
            >
              <div className="flex items-center">
                <div className="flex gap-3 pr-2.5 text-[28px]">
                  <FaCcVisa title="Visa" className="text-[#1a1f71]" />           {/* Azul Visa */}
                  <FaCcMastercard title="MasterCard" className="text-[#eb001b]" /> {/* Rojo MasterCard */}
                  <FaCcAmex title="American Express" className="text-[#2e77bc]" /> {/* Azul AMEX */}
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
