// components/ProductForm/ProductImageManager.tsx
import React from 'react';
import type { Images } from '../../../../types/product'; // Assuming your Image type is here

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
      <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes (URLs)</label>
      {(images ?? []).map((img, idx) => (
        <div key={idx} className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 flex-shrink-0 border rounded overflow-hidden bg-gray-100">
            {img.url ? (
              <img
                src={img.url}
                alt={`Imagen ${idx + 1}`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">Sin imagen</div>
            )}
          </div>
          <input
            type="text"
            value={img.url}
            onChange={(e) => onImageChange(idx, e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
            placeholder={`URL de imagen #${idx + 1}`}
            required
          />
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