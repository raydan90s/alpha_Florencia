import React from 'react';

interface ProductFormActionsProps {
  isLoading: boolean;
  isNewProduct: boolean;
  isFormInvalid: boolean;
  resetForm: () => void;
  scrollToTop?: () => void; 
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const ProductFormActions: React.FC<ProductFormActionsProps> = ({
  isLoading,
  isNewProduct,
  resetForm,
  isFormInvalid,
  scrollToTop,
  handleSubmit,
}) => {
  const handleCancel = () => {
    resetForm();
    if (scrollToTop) {
      scrollToTop();
    }
  };

  return (
    <div className="md:col-span-2 flex justify-end gap-4 mt-6">
      <button
        type="button"
        onClick={handleCancel}
        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        disabled={isLoading}
      >
        Cancelar
      </button>
      <button
        type="button"  // Correcto para manejar manualmente el evento
        onClick={(e) => handleSubmit(e)}  // Llamando handleSubmit cuando el botón es presionado
        className="bg-[#003366] text-white px-4 py-2 rounded-md hover:bg-[#004488] disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading || isFormInvalid}
      >
        {isLoading
          ? "Procesando..."
          : isNewProduct
            ? "Agregar producto"
            : "Guardar cambios"}
      </button>
    </div>
  );
};

export default ProductFormActions;
