"use client";

import { useEffect, useState } from "react";

interface ProductoInventario {
  nombre: string;
  stock: number;
}

interface InventarioConProductos {
  id: number;
  ubicacion: string;
  productos: ProductoInventario[];
}

export default function InventoryManager() {
  const [ubicacion, setUbicacion] = useState("");
  const [inventarios, setInventarios] = useState<InventarioConProductos[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [filtroUbicacion, setFiltroUbicacion] = useState<"todos" | number>("todos");

  useEffect(() => {
    fetchInventariosConProductos();
  }, []);

  const fetchInventariosConProductos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inventario-productos`, {
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY,
        }
      });
      const data = await res.json();
      setInventarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener inventarios con productos:", err);
    }
  };

  const handleAddInventory = async () => {
    const trimmedUbicacion = ubicacion.trim();
    if (!trimmedUbicacion) {
      alert("Debe ingresar una ubicación.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inventario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-API-Key': import.meta.env.VITE_API_KEY,
        },
        credentials: "include",
        body: JSON.stringify({ ubicacion: trimmedUbicacion }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al guardar ubicación");

      setSuccessMessage("Ubicación de inventario agregada correctamente.");
      setUbicacion("");
      fetchInventariosConProductos();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Error al guardar ubicación:", err.message || err);
      alert("No se pudo guardar la ubicación.");
    }
  };

  const isButtonDisabled = !ubicacion.trim();

  // Filtra los inventarios según el filtro actual
  const inventariosFiltrados =
    filtroUbicacion === "todos"
      ? inventarios
      : inventarios.filter((inv) => inv.id === filtroUbicacion);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h4 className="font-semibold mb-4">Agregar Ubicación de Inventario</h4>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 border border-green-300 rounded">
          {successMessage}
        </div>
      )}

      <input
        type="text"
        placeholder="Nombre de la ubicación"
        value={ubicacion}
        onChange={(e) => setUbicacion(e.target.value)}
        className="border px-4 py-2 rounded w-full mb-3"
      />

      <button
        onClick={handleAddInventory}
        className={`px-4 py-2 rounded w-full mb-6 ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#003366] hover:bg-blue-600 text-white"
          }`}
        disabled={isButtonDisabled}
      >
        Guardar Ubicación
      </button>

      <h4 className="font-semibold mb-2">Filtrar por ubicación</h4>
      <select
        value={filtroUbicacion}
        onChange={(e) =>
          setFiltroUbicacion(e.target.value === "todos" ? "todos" : parseInt(e.target.value))
        }
        className="mb-4 border px-4 py-2 rounded w-full"
      >
        <option value="todos">Ver todos los inventarios</option>
        {inventarios.map((inv) => (
          <option key={inv.id} value={inv.id}>
            {inv.ubicacion}
          </option>
        ))}
      </select>

      <h4 className="font-semibold mb-2">Ubicaciones Registradas</h4>

      {inventariosFiltrados.length === 0 ? (
        <p className="text-gray-500">No hay ubicaciones registradas.</p>
      ) : (
        <ul className="space-y-4">
          {inventariosFiltrados.map((inv) => (
            <li key={inv.id} className="border rounded p-4 bg-gray-50">
              <h5 className="font-semibold text-lg">{inv.ubicacion}</h5>
              {inv.productos.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay productos en esta ubicación.</p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm">
                  {inv.productos.map((prod, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{prod.nombre}</span>
                      <span className="font-semibold">Stock: {prod.stock}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
