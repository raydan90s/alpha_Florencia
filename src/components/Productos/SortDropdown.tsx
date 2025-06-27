"use client";

import React from "react";
import { useFilter } from "../../context/FilterContext";

const SortDropdown: React.FC = () => {
  const { sortCriteria, setSortCriteria } = useFilter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortCriteria(e.target.value as typeof sortCriteria);
  };

  return (
    <div className="mb-4">
      <label htmlFor="sort" className="mr-2 font-medium text-gray-700">
        Ordenar por:
      </label>
      <select
        id="sort"
        value={sortCriteria}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-1 text-sm"
      >
        <option value="">-- Seleccionar --</option>
        <option value="precioAsc">Precio (ascendente)</option>
        <option value="precioDesc">Precio (descendente)</option>
        <option value="marcaAsc">Marca (A-Z)</option>
        <option value="marcaDesc">Marca (Z-A)</option>
        <option value="modeloAsc">Modelo (A-Z)</option>
        <option value="modeloDesc">Modelo (Z-A)</option>
        <option value="categoriaAsc">Categoría (A-Z)</option>
        <option value="categoriaDesc">Categoría (Z-A)</option>
      </select>
    </div>
  );
};

export default SortDropdown;
