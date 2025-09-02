"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Brand {
  id: number;
  nombre: string;
}

interface Model {
  id: number;
  nombre: string;
  id_marca: number;
}

export default function ModelManager() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [newModel, setNewModel] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Obtener marcas al cargar el componente
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/marcas`, {
      headers: {
        'X-API-Key': import.meta.env.VITE_API_KEY,
      }
    })
      .then(res => setBrands(res.data as Brand[]))
      .catch(err => console.error("Error al obtener marcas:", err));
  }, []);

  // Obtener modelos cada vez que se selecciona una marca
  useEffect(() => {
    if (selectedBrandId) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/modelos/${selectedBrandId}`, {
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY
        }
      })
        .then(res => setModels(res.data as Model[])) // Afirmación de tipo
        .catch(err => console.error("Error al obtener modelos:", err));
    } else {
      setModels([]);
    }
  }, [selectedBrandId]);

  const handleAddModel = async () => {
    const nombre = newModel.trim();

    if (!nombre || !selectedBrandId) {
      alert("Debe ingresar un nombre y seleccionar una marca.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/modelos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-API-Key': import.meta.env.VITE_API_KEY,
        },
        credentials: "include",
        body: JSON.stringify({ nombre, id_marca: selectedBrandId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al guardar modelo");

      setSuccessMessage("Modelo agregado correctamente.");
      setNewModel("");

      // Recargar los modelos
      const updatedModels = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/modelos/${selectedBrandId}`, {
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY,
        }
      });
      setModels(updatedModels.data as Model[]); // Afirmación de tipo

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Error al guardar modelo:", err.message || err);
      alert("No se pudo guardar el modelo.");
    }
  };

  const isInputDisabled = !selectedBrandId;
  const isButtonDisabled = !selectedBrandId || !newModel.trim();

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h4 className="font-semibold mb-4">Agregar Modelo</h4>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 border border-green-300 rounded">
          {successMessage}
        </div>
      )}

      <select
        value={selectedBrandId || ""}
        onChange={(e) => setSelectedBrandId(Number(e.target.value))}
        className="border px-4 py-2 rounded w-full mb-3"
      >
        <option value="" disabled>Selecciona una marca</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>{brand.nombre}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Nombre del modelo"
        value={newModel}
        onChange={(e) => setNewModel(e.target.value)}
        className="border px-4 py-2 rounded w-full mb-3"
        disabled={isInputDisabled}
      />

      <button
        onClick={handleAddModel}
        className={`px-4 py-2 rounded w-full ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#003366] hover:bg-blue-600 text-white'}`}
        disabled={isButtonDisabled}
      >
        Guardar Modelo
      </button>

      {/* Lista de modelos */}
      {selectedBrandId && (
        <div className="mt-6">
          <h5 className="font-medium mb-2">Modelos de la marca seleccionada:</h5>
          {models.length > 0 ? (
            <ul className="list-disc list-inside">
              {models.map(model => (
                <li key={model.id}>{model.nombre}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay modelos disponibles para esta marca.</p>
          )}
        </div>
      )}
    </div>
  );
}
