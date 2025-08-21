// components/ProductForm/ProductDetailsFields.tsx
import React from 'react';
import type { Product, Images } from '../../../../types/product';
interface ProductDetailsFieldsProps {
  currentProduct: Partial<Product> & { images?: Images[] };
  setCurrentProduct: React.Dispatch<React.SetStateAction<Partial<Product> & { images?: Images[] }>>;
  modelos: { id: number; nombre: string }[];
  marcasDisponibles: { id: number; nombre: string }[];
  inventarioSeleccionado: string;
  setInventarioSeleccionado: React.Dispatch<React.SetStateAction<string>>;
  inventariosDB: { id: number; stock?: number; nombre: string; cantidad?: number }[];
}

const ProductDetailsFields: React.FC<ProductDetailsFieldsProps> = ({
  currentProduct,
  setCurrentProduct,
  modelos,
  marcasDisponibles,
  inventarioSeleccionado,
  setInventarioSeleccionado,
  inventariosDB,
}) => {
  return (
    <>
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          type="text"
          value={currentProduct.name || ''}
          onChange={(e) =>
            setCurrentProduct({ ...currentProduct, name: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
        <input
          type="text"
          inputMode="decimal" // Permite ingreso numérico decimal en móviles
          value={
            currentProduct.price !== undefined
              ? currentProduct.price.toString()
              : ''
          }
          onChange={(e) => {
            const value = e.target.value;

            // Permitir cualquier valor temporalmente
            setCurrentProduct((prev) => ({
              ...prev,
              price: value === '' ? undefined : value as unknown as number, // aún es string temporalmente
            }));
          }}
          onBlur={(e) => {
            const rawValue = e.target.value.trim();
            const parsed = parseFloat(rawValue);

            // Asegurar que sea número válido y positivo
            if (!isNaN(parsed) && parsed > 0) {
              setCurrentProduct((prev) => ({
                ...prev,
                price: parseFloat(parsed.toFixed(2)),
              }));
            } else {
              // Si no es válido, lo dejamos vacío
              setCurrentProduct((prev) => ({
                ...prev,
                price: undefined,
              }));
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>



      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <select
          value={currentProduct.category || ""}
          onChange={(e) =>
            setCurrentProduct({
              ...currentProduct,
              category: e.target.value as "TONER" | "TINTA" | "CUCHILLA" | "CILINDRO",
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Seleccionar categoría</option>
          <option value="TONER">Tóner</option>
          <option value="TINTA">Tinta</option>
          <option value="CUCHILLA">Cuchilla</option>
          <option value="CILINDRO">Cilindro</option>
        </select>
      </div>

      {/* Inventory */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Inventario</label>
        <select
          value={inventarioSeleccionado}
          onChange={(e) => setInventarioSeleccionado(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="Total">Total</option>
          {inventariosDB.map((inv) => (
            <option key={inv.id} value={inv.nombre}>
              {inv.nombre}
            </option>
          ))}
        </select>
      </div>


      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
        <input
          type="number"
          min="0"
          value={
            typeof currentProduct.stock === "number" && !isNaN(currentProduct.stock)
              ? currentProduct.stock
              : ""
          }
          onChange={(e) => {
            const value = e.target.value;
            const parsed = parseInt(value, 10);

            if (value === '' || parsed >= 0) {
              setCurrentProduct({
                ...currentProduct,
                stock: value === '' ? undefined : parsed,
              });
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>


      {/* Model (conditionally rendered) */}
      {modelos.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
          <select
            value={currentProduct.model || ""}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                model: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Seleccione Modelo</option>
            {modelos.map((m) => (
              <option key={m.id} value={m.nombre}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
        <select
          value={currentProduct.brand || ""}
          onChange={(e) =>
            setCurrentProduct({
              ...currentProduct,
              brand: e.target.value,
              model: "", // Reset model when brand changes
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Seleccione Marca</option>
          {marcasDisponibles.map((m) => (
            <option key={m.id} value={m.nombre}>{m.nombre}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={currentProduct.description || ''}
          onChange={(e) =>
            setCurrentProduct({
              ...currentProduct,
              description: e.target.value,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
          required
        />
      </div>
    </>
  );
};

export default ProductDetailsFields;