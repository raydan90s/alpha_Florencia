// components/ProductForm/ProductImageManager.tsx
import React from "react";
import type { Images } from "../../../../types/product";
import { subirImagen } from "../../../../utils/claudinary"; // importa tu función

interface ProductImageManagerProps {
  images: Images[];
  onImageChange: (index: number, newUrl: string) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
}

const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  images,
  onImageChange,
  onAddImage,
  onRemoveImage,
}) => {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Imágenes
      </label>

      {(images ?? []).map((img, idx) => (
        <div key={idx} className="flex items-center gap-4 mb-4">
          {/* Miniatura */}
          <div className="w-20 h-20 flex-shrink-0 border rounded overflow-hidden bg-gray-100">
            {img.url ? (
              <img
                src={img.url}
                alt={`Imagen ${idx + 1}`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Sin imagen
              </div>
            )}
          </div>

          {/* Input para subir archivo */}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;
              const url = await subirImagen(e.target.files[0]);
              onImageChange(idx, url);
            }}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
          />

          {/* Botón eliminar */}
          <button
            type="button"
            onClick={() => onRemoveImage(idx)}
            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            aria-label={`Eliminar imagen #${idx + 1}`}
          >
            X
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={onAddImage}
        className="mt-2 px-4 py-2 text-white rounded-md hover:bg-green-700 bg-[#003366]"
      >
        + Agregar Imagen
      </button>
    </div>
  );
};

export default ProductImageManager;
