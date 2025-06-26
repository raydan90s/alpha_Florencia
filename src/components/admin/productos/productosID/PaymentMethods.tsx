"use client";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";

export default function PaymentMethods() {
  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-3 text-gray-800">Pago Seguro Garantizado</h3>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center justify-center w-[70px] h-[50px] bg-white shadow-sm rounded-xl p-2">
          <FaCcVisa title="Visa" className="text-[#1a1f71] text-6xl" />
        </div>
        <div className="flex items-center justify-center w-[70px] h-[50px] bg-white shadow-sm rounded-xl p-2">
          <FaCcMastercard title="MasterCard" className="text-[#eb001b] text-6xl" />
        </div>
        <div className="flex items-center justify-center w-[70px] h-[50px] bg-white shadow-sm rounded-xl p-2">
          <FaCcAmex title="American Express" className="text-[#2e77bc] text-6xl" />
        </div>
      </div>
    </div>
  );
}
