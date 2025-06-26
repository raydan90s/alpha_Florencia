"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from '@/context/ProductContext';

import { obtenerMarcasDisponibles, obtenerModelosDisponibles } from '@/components/SearchForm/motor';

const SearchForm: React.FC = () => {
    const { products: productosContext } = useProducts();

    // Memoizamos productos para evitar que sea un nuevo array en cada render
    const productos = useMemo(() => productosContext || [], [productosContext]);

    const [searchQuery, setSearchQuery] = useState("");
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const router = useRouter();

    const marcasDisponibles = useMemo(() => obtenerMarcasDisponibles(productos), [productos]);
    const modelosDisponibles = useMemo(() => obtenerModelosDisponibles(productos, marca), [productos, marca]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const query = new URLSearchParams({
            q: searchQuery,
            marca: marca,
            modelo: modelo,
        }).toString();
        router.push(`/productos/?${query}`);
    };

    const handleClear = () => {
        setSearchQuery("");
    };

    return (
        <div className="bg-[#003366] p-4 sm:p-6 rounded-lg w-full max-w-md mx-auto">
            <h2 className="text-white text-lg sm:text-xl font-semibold mb-4">
                Buscar por tóner
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input
                        type="search"
                        placeholder="Escriba su tóner o tinta aquí..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            className="absolute right-8 top-1/2 -translate-y-1/2"
                            aria-label="Limpiar"
                            onClick={handleClear}
                        >
                            ✕
                        </button>
                    )}
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        aria-label="Buscar"
                    >
                        🔍
                    </button>
                </div>

                <p className="text-white text-center text-sm sm:text-base my-2">
                    Buscar por impresora
                </p>

                <div className="space-y-3">
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        value={marca}
                        onChange={(e) => {
                            setMarca(e.target.value);
                            setModelo("");
                        }}
                    >
                        <option value="">Seleccione Marca</option>
                        {marcasDisponibles.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    {modelosDisponibles.length > 0 && (
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                        >
                            <option value="">Seleccione Modelo</option>
                            {modelosDisponibles.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#FF6B00] text-white py-2 rounded-md hover:bg-[#FF8533] transition-colors"
                    >
                        Buscar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchForm;
