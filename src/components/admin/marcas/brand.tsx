"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Brand {
  id: number;
  nombre: string;
}

export default function BrandManager() {
  const [marcas, setMarcas] = useState<Brand[]>([]);
  const [newBrand, setNewBrand] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMarcas();
  }, []);

  const fetchMarcas = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/marcas`);
      setMarcas(res.data);
    } catch (err) {
      console.error("Error al obtener marcas:", err);
    }
  };

  const handleAddBrand = async () => {
    const nombre = newBrand.trim();
    if (!nombre) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/marcas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nombre }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");

      setNewBrand("");
      await fetchMarcas(); // Refresca desde la base de datos
    } catch (error) {
      console.error("Error al guardar marca:", error);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = !newBrand.trim() || loading;

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h4 className="font-semibold mb-4">Agregar Marca</h4>
      <div className="space-y-2">
        <input
          type="text"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          placeholder="Nombre de la nueva marca"
          className="border px-4 py-2 rounded w-full"
        />
        <div className="flex space-x-2">
          <button
            onClick={handleAddBrand}
            disabled={isButtonDisabled}
            className={`px-4 py-2 rounded w-full ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#003366] hover:bg-blue-600 text-white'}`}
          >
            Guardar Marca
          </button>
        </div>
      </div>
      <h4 className="font-semibold mb-4">Listado de Marcas</h4>

      <ul className="space-y-2 mb-6">
        {marcas.map((marca) => (
          <li key={marca.id} className="flex justify-between items-center border px-4 py-2 rounded">
            <span>{marca.nombre}</span>
          </li>
        ))}
      </ul>

      
    </div>
  );
}
