import React from "react";
import { Link } from "react-router-dom"; // Usamos Link de react-router-dom
import type { Product } from "../../types/product"; // Asegúrate de tener la interfaz Product

// Definimos las interfaces para las props
interface ProductGridProps {
  products: Product[]; // Array de productos
  addedProductId: number | null; // ID del producto que fue agregado al carrito
  onAddToCart: (product: Product) => void; // Función para agregar el producto al carrito
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  addedProductId,
  onAddToCart,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => {
        // Ordenamos las imágenes por la propiedad 'orden', asegurándonos de que 'orden' esté definido
        const sortedImages = product.images?.slice().sort((a, b) => {
          const aOrden = a.orden ?? 0; // Si 'a.orden' no está definido, usamos 0 por defecto
          const bOrden = b.orden ?? 0; // Lo mismo para 'b.orden'
          return aOrden - bOrden;
        });

        return (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Usamos solo el slug para redirigir */}
            <Link to={`/productos/${product.slug}`}>
              <div className="relative h-48 cursor-pointer">
                {/* Usamos el elemento img estándar */}
                {sortedImages?.[0]?.url && (
                  <img
                    src={sortedImages[0].url}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            </Link>
            <div className="p-6">
              {/* Enlace para el nombre del producto con el slug */}
              <Link to={`/productos/${product.slug}`}>
                <h3 className="text-lg font-semibold cursor-pointer">{product.name}</h3>
              </Link>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-sm text-gray-500 mb-2">Modelo: {product.model}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xl font-bold text-[#003366]">
                  ${product.price?.toFixed(2)}
                </span>
                <button
                  onClick={() => onAddToCart(product)} // Llamada a la función de agregar al carrito
                  disabled={addedProductId === product.id} // Deshabilitar si el producto ya está agregado
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
