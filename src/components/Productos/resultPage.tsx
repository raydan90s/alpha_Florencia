// app/resultados/page.tsx o similar
"use client";
import React, { useMemo, useState } from "react";
import { useProducts } from "@/context/ProductContext";
import { Product } from "@/types/product";
import { filtrarProductos } from "@/components/SearchForm/motor";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";
import { useFilter } from "@/context/FilterContext";
import ProductGrid from "@/components/Productos/ProductGrid";

const ResultsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const categoria = searchParams.get("marca") || "";
  const modelo = searchParams.get("modelo") || "";

  const { products } = useProducts();
  const { agregarAlCarrito } = useCart();
  const { sortCriteria } = useFilter();

  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  const results: Product[] = useMemo(() => {
    let filtered = products.filter((p) => p.estado?.toLowerCase().trim() === "activo");

    if (categoria && categoria !== "Todos") {
      filtered = filtered.filter(
        (p) => p.brand?.toLowerCase() === categoria.toLowerCase()
      );
    }

    if (modelo) {
      filtered = filtered.filter(
        (p) => p.model?.toLowerCase() === modelo.toLowerCase()
      );
    }

    if (searchQuery.trim() !== "") {
      filtered = filtrarProductos(filtered, searchQuery);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortCriteria) {
        case "precioAsc":
          return (a.price ?? 0) - (b.price ?? 0);
        case "precioDesc":
          return (b.price ?? 0) - (a.price ?? 0);
        case "marcaAsc":
          return (a.brand ?? "").localeCompare(b.brand ?? "");
        case "marcaDesc":
          return (b.brand ?? "").localeCompare(a.brand ?? "");
        case "modeloAsc":
          return (a.model ?? "").localeCompare(b.model ?? "");
        case "modeloDesc":
          return (b.model ?? "").localeCompare(a.model ?? "");
        case "categoriaAsc":
          return (a.category ?? "").localeCompare(b.category ?? "");
        case "categoriaDesc":
          return (b.category ?? "").localeCompare(a.category ?? "");
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchQuery, categoria, modelo, sortCriteria]);

  const handleAddToCart = (product: Product) => {
  agregarAlCarrito({
    id: product.id,
    name: product.name,
    cantidad: 1,
    precio: product.price,
    images: product.images || [], // ← CORREGIDO
  });
  setAddedProductId(product.id);
  setTimeout(() => setAddedProductId(null), 2000);
};


  return (
    <div className="container mx-auto p-4">
      {results.length > 0 ? (
        <ProductGrid
          products={results}
          addedProductId={addedProductId}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <p className="text-center text-gray-600">No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default ResultsPage;
