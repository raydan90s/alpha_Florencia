"use client";
import React from "react";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

interface ProductGridProps {
  products: Product[];
  addedProductId: number | null;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  addedProductId,
  onAddToCart,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => {
        const sortedImages = product.images?.slice().sort((a, b) => a.orden - b.orden);

        return (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link href={`/productos/${product.id}`}>
              <div className="relative h-48 cursor-pointer">
                {sortedImages?.[0]?.url && (
                  <Image
                    src={sortedImages[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </Link>
            <div className="p-6">
              <Link href={`/productos/${product.id}`}>
                <h3 className="text-lg font-semibold cursor-pointer">{product.name}</h3>
              </Link>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-sm text-gray-500 mb-2">Modelo: {product.model}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xl font-bold text-[#003366]">
                  ${product.price?.toFixed(2)}
                </span>
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={addedProductId === product.id}
                  className={`px-4 py-2 rounded-md text-white transition-colors duration-200 
                      ${addedProductId === product.id
                        ? "bg-green-500"
                        : "bg-[#FF6B00] hover:bg-[#FF8533]"}`}
                >
                  {addedProductId === product.id ? "✓ Agregado" : "Agregar al carrito"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
