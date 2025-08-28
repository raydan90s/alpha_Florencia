import { useState, useMemo } from "react";
import { useProducts } from "../../context/ProductContext";
import type { Product } from "../../types/product";
import { useCart } from "../../context/CartContext";
import ProductGrid from "./ProductGrid";

interface RelatedProductsByBrandProps {
  currentProduct: Product;
  maxProducts?: number;
}

export default function RelatedProductsByBrand({
  currentProduct,
  maxProducts = 3, 
}: RelatedProductsByBrandProps) {
  const { products } = useProducts();
  const { agregarAlCarrito } = useCart();

  // Estado para manejar el producto agregado al carrito
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  // Filtrar productos de la misma marca excluyendo el actual
  const relatedProducts = useMemo(() => {
    if (!currentProduct.brand) return [];

    return products
      .filter(
        (product) =>
          product.brand?.toLowerCase() ===
            currentProduct.brand?.toLowerCase() &&
          product.id !== currentProduct.id
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, maxProducts); // limitar a 4 productos
  }, [products, currentProduct, maxProducts]);

  // Si no hay productos relacionados, no mostramos nada
  if (relatedProducts.length === 0) return null;

  const handleAddToCart = (product: Product) => {
    agregarAlCarrito({
      id: product.id,
      name: product.name,
      cantidad: 1,
      precio: product.price,
      images: product.images || [],
    });

    setAddedProductId(product.id);

    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);
  };

  return (
    <div className="mt-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="pt-12 pb-8">
        <div className="text-center mb-12 px-6 md:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Más productos de{" "}
            <span className="bg-black bg-clip-text text-transparent">
              {currentProduct.brand}
            </span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Descubre otros productos excepcionales de la misma marca que te
            pueden interesar
          </p>
        </div>

        <ProductGrid
          products={relatedProducts}
          addedProductId={addedProductId}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
