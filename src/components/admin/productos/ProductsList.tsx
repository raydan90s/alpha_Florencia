import React, { useMemo } from "react";
import { Product } from "@/types/product";
import { useProducts } from "@/context/ProductContext";
import { useFilter } from "@/context/FilterContext";
import Image from "next/image";

interface ProductsListProps {
  handleEdit?: (product: Product) => void;
  handleDelete?: (id: string | number) => void;
  handleActive?: (id: string | number) => void;
  isLoading?: boolean;
  handleNewProduct?: () => void;
  isNewProduct?: boolean;
  cancelNewProduct?: () => void;
  searchTerm?: string;
}

const ProductsList: React.FC<ProductsListProps> = ({
  handleEdit,
  handleDelete,
  handleActive,
  handleNewProduct,
  isLoading = false,
  isNewProduct,
  searchTerm = "",
}) => {
  const { products } = useProducts();
  const {
    filterCategory,
    filterEstado,
    filterModelo,
    filterMarca,
    filterPriceMin,
    filterPriceMax,
    filterStockMin,
    filterStockMax,
    sortCriteria,
  } = useFilter();

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          !searchTerm ||
          product.name.toLowerCase().includes(searchTerm.toLowerCase());

        return (
          matchesSearch &&
          (!filterCategory || product.category === filterCategory) &&
          (!filterEstado || product.estado === filterEstado) &&
          (!filterModelo ||
            product.model?.toLowerCase().includes(filterModelo.toLowerCase())) &&
          (!filterMarca ||
            product.brand?.toLowerCase().includes(filterMarca.toLowerCase())) &&
          (!filterPriceMin || product.price >= parseFloat(filterPriceMin)) &&
          (!filterPriceMax || product.price <= parseFloat(filterPriceMax)) &&
          (!filterStockMin || product.stock >= parseInt(filterStockMin)) &&
          (!filterStockMax || product.stock <= parseInt(filterStockMax))
        );
      })
      .sort((a, b) => {
        switch (sortCriteria) {
          case "estado":
            return (a.estado ?? "").localeCompare(b.estado ?? "");
          case "precioAsc":
            return (a.price ?? 0) - (b.price ?? 0);
          case "precioDesc":
            return (b.price ?? 0) - (a.price ?? 0);
          case "stockAsc":
            return (a.stock ?? 0) - (b.stock ?? 0);
          case "stockDesc":
            return (b.stock ?? 0) - (a.stock ?? 0);
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
  }, [
    products,
    searchTerm,
    filterCategory,
    filterEstado,
    filterModelo,
    filterMarca,
    filterPriceMin,
    filterPriceMax,
    filterStockMin,
    filterStockMax,
    sortCriteria,
  ]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredProducts.length > 0 ? (
            <>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.id ?? `fallback-key-${index}`}
                  onClick={() => handleEdit?.(product)}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.images?.[0]?.url && (
                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                          <Image
                            className="h-10 w-10 object-cover rounded-md"
                            src={product.images[0].url}
                            alt={product.name}
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.description?.substring(0, 50)}
                          {product.description?.length > 50 && "..."}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${typeof product.price === "number" ? product.price.toFixed(2) : "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {product.stock ?? "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.estado}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {product.estado === "Activo" ? (
                      <button
                        onClick={() => handleDelete?.(product.id)}
                        className="text-red-600 hover:text-red-900 mr-4"
                        disabled={isLoading}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActive?.(product.id)}
                        className="text-green-600 hover:text-green-800"
                        disabled={isLoading}
                      >
                        Activar
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {!isNewProduct && (
                <tr
                  key="new-product-row"
                  onClick={handleNewProduct}
                  className="cursor-pointer bg-green-50 hover:bg-green-100 transition duration-200"
                >
                  <td colSpan={6} className="px-6 py-4 text-center text-green-700 font-semibold text-sm">
                    + Agregar nuevo producto
                  </td>
                </tr>
              )}
            </>
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                No hay productos para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

};

export default ProductsList;