// components/MetodoEnvio.tsx
import React from "react";
import Image from "next/image";
import { useConfiguracion } from "@/context/SettingContext";

const MetodoEnvio = () => {
  const { configuracion, loading } = useConfiguracion();

  const costoEnvio = configuracion?.precio_envio ?? 0;

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Método de Envío</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-4">
          <label htmlFor="servientrega" className="flex cursor-pointer items-center gap-3.5">
            <div className="relative">
              <input
                type="radio"
                id="servientrega"
                name="envio"
                className="sr-only"
                defaultChecked
              />
              <div className={`h-4 w-4 rounded-full border-4 border-blue`} />
            </div>

            <div className="rounded-md border px-5 py-3.5 hover:bg-gray-2">
              <div className="flex items-center">
                <Image
                  src="/images/checkout/servientrega.png"
                  alt="servientrega"
                  width={64}
                  height={18}
                  className="pr-4"
                />
                <div className="border-l border-gray-4 pl-4">
                  <p className="font-semibold text-dark">
                    {loading ? "Cargando..." : `$${costoEnvio.toFixed(2)}`}
                  </p>
                  <p className="text-custom-xs">Envío Estándar</p>
                  <p className="text-custom-xs text-gray-500">Entrega en 2 a 3 días hábiles</p>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default MetodoEnvio;
