"use client";

import { useState } from "react";
import { useConfiguracion } from "@/context/SettingContext";
import axios from "axios";

export default function PrecioEnvioConfig() {
  const { configuracion, reload } = useConfiguracion();
  const [nuevoPrecioEnvio, setNuevoPrecioEnvio] = useState("");

  const handleActualizarPrecioEnvio = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/configuracion/precio-envio`, {
        precio_envio: parseFloat(nuevoPrecioEnvio),
      });
      setNuevoPrecioEnvio("");
      reload();
    } catch {
      alert("Error al actualizar precio de envío");
    }
  };

  return (
    <div>
        <input
          type="number"
          placeholder="Nuevo precio de envío"
          value={nuevoPrecioEnvio}
          onChange={(e) => setNuevoPrecioEnvio(e.target.value)}
          className="border px-4 py-2 rounded w-full mb-2"
        />
        <button onClick={handleActualizarPrecioEnvio} className="px-2 py-2 rounded w-fit bg-[#003366] hover:bg-blue-600 text-white mb-6">
          Actualizar precio de envío
        </button>
      </div>
  );
}
