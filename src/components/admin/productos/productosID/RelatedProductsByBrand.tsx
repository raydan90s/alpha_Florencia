import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Cambiar a useNavigate de react-router-dom
import { Link } from "react-router-dom"; // Cambiar Link de next/link por el de react-router-dom
import { useProducts } from "../../../../context/ProductContext";
import type { Product } from "../../../../types/product";
import { useCart } from "../../../../context/CartContext";

interface RelatedProductsByBrandProps {
  currentProduct: Product;
  maxProducts?: number;  // Opcional, con un valor por defecto luego
}

export default function RelatedProductsByBrand({
  currentProduct,
}: RelatedProductsByBrandProps) {
  const { products } = useProducts();
  const navigate = useNavigate(); // Reemplazamos useRouter por useNavigate de react-router-dom
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const { agregarAlCarrito } = useCart();
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  // Filtrar productos de la misma marca excluyendo el producto actual
  const relatedProducts = useMemo(() => {
    if (!currentProduct.brand) return [];

    return products.filter(
      (product) =>
        product.brand?.toLowerCase() === currentProduct.brand?.toLowerCase() &&
        product.id !== currentProduct.id
    );
  }, [products, currentProduct]);

  // Si no hay productos relacionados, no mostrar el componente
  if (relatedProducts.length === 0) return null;

  const handleAddToCart = (product: Product) => {
    agregarAlCarrito({
      id: product.id,
      name: product.name,
      cantidad: 1,
      precio: product.price,
      images: product.images || [], // ← AGREGADO
    });

    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const getValidImageUrl = (product: Product): string | null => {
    // Si esta imagen ya falló, no intentar de nuevo
    if (failedImages.includes(String(product.id))) return null;

    // Lista de posibles URLs de imagen
    const imageUrls = [
      ...(product.images?.sort((a, b) => (a.orden || 0) - (b.orden || 0))?.map(img => img.url) || []),
      product.primera_imagen_url,
      product.image
    ].filter(Boolean); // Eliminar valores null/undefined

    return imageUrls[0] || null;
  };

  const handleImageError = (productId: number) => {
    setFailedImages(prev => {
      const idStr = String(productId);
      if (prev.includes(idStr)) return prev; // ya está registrado
      return [...prev, idStr];
    });
  };

  return (
    <div className="mt-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="pt-12 pb-8">
        <div className="text-center mb-12 px-6 md:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Más productos de{" "}
            <span className="bg-gradient-to-r from-[#003366] to-[#FF6B00] bg-clip-text text-transparent">
              {currentProduct.brand}
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#003366] to-[#FF6B00] mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Descubre otros productos excepcionales de la misma marca que te
            pueden interesar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {relatedProducts.map((product) => {
            const imageUrl = getValidImageUrl(product);

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to={`/productos/${product.id}`}>
                  <div className="relative h-48 cursor-pointer group overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => handleImageError(product.id)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center p-4">
                          <div className="w-16 h-16 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-500 font-medium">Imagen no disponible</p>
                        </div>
                      </div>
                    )}

                    {/* Badge de stock */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`text-white text-xs px-2 py-1 rounded-full font-medium ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                        {product.stock > 0 ? 'En Stock' : 'Agotado'}
                      </span>
                    </div>

                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>
                </Link>

                <div className="p-6">
                  <Link to={`/productos/${product.id}`}>
                    <h3 className="text-lg font-semibold cursor-pointer hover:text-[#003366] transition-colors duration-200 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    {product.model && <span>Modelo: {product.model}</span>}
                    {product.category && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {product.category}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#003366]">
                      ${(product.price || 0).toFixed(2)}
                    </span>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300 ${product.stock === 0
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-[#FF6B00] hover:bg-[#E55B00] text-white shadow-md hover:shadow-lg transform hover:scale-105"
                        }`}
                    >
                      {product.stock === 0 ? "Sin Stock" : "Agregar"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón para ver todos los productos de la marca */}
        <div className="text-center mt-12 px-6 md:px-0">
          <button
            onClick={() =>
              navigate(`/productos?brand=${encodeURIComponent(currentProduct.brand || "")}`)
            }
            className="inline-flex items-center px-8 py-3 bg-[#FF6B00] hover:bg-[#E55B00] text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <span>Ver toda la colección de {currentProduct.brand}</span>
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
