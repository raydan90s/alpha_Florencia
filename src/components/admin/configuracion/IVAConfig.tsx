"use client";

import { useState } from "react";
import { useConfiguracion } from "../../../context/SettingContext";
import axios from "axios";

export default function IVAConfig() {
    const { configuracion, reload } = useConfiguracion();
    const [nuevoIVA, setNuevoIVA] = useState("");

    const handleAgregarIVA = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/configuracion/iva`, {
                valor: parseInt(nuevoIVA),
                activo: true,
            });
            setNuevoIVA("");
            reload();
        } catch {
            alert("Error al agregar nuevo IVA");
        }
    };

    return (
        <div className="mb-3">
            <input
                type="number"
                placeholder="Nuevo IVA (%)"
                value={nuevoIVA}
                onChange={(e) => setNuevoIVA(e.target.value)}
                className="border px-4 py-2 rounded w-full mb-2"
            />
            <button onClick={handleAgregarIVA} className="px-4 py-2 rounded w-fit bg-[#003366] hover:bg-blue-600 text-white mb-6">
                Agregar nuevo IVA
            </button>
        </div>
    );
}
