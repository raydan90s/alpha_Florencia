import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import ProductDetailsFields from './ProductForm/ProductDetailsFields';
import ProductImageManager from './ProductForm/ProductImageManager';
import ProductFormActions from './ProductForm/ProductFormActions';
import type { Images, Product } from '../../../types/product';
import { obtenerModelosPorMarca, obtenerMarcasDisponibleApi } from '../../../components/SearchForm/motor';

interface ProductFormProps {
  currentProduct: Partial<Product> & { images?: Images[] };
  setCurrentProduct: React.Dispatch<React.SetStateAction<Partial<Product> & { images?: Images[] }>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isEditing: boolean;
  isLoading: boolean;
  resetForm: () => void;
  isNewProduct: boolean;
  productos: Product[]; // This prop is not used in the original component logic, so it's kept but noted.
}

const ProductForm: React.FC<ProductFormProps> = ({
  currentProduct,
  setCurrentProduct,
  handleSubmit,
  isEditing,
  isLoading,
  resetForm,
  isNewProduct,
}) => {
  const [modelos, setModelos] = useState<{ id: number; nombre: string }[]>([]);
  const [marcasDisponibles, setMarcasDisponibles] = useState<{ id: number; nombre: string }[]>([]);
  const [inventarioSeleccionado, setInventarioSeleccionado] = useState<string>('Total');
  const [inventariosDB, setInventariosDB] = useState<{
    id: number, stock?: number; nombre: string; cantidad?: number
  }[]>([]);
  const topRef = useRef<HTMLDivElement>(null);

  // Validar el formulario
  const isFormValid = (): boolean => {
  const requiredFields = ['name', 'price', 'category', 'stock', 'model', 'brand', 'description'];

  // Aseguramos que todos los campos requeridos tengan un valor válido (ni undefined, null, ni vacío)
  const allFieldsFilled = requiredFields.every((field) => {
    const value = (currentProduct as any)[field];
    return value !== undefined && value !== '' && value !== null; // Asegura que no sea undefined ni null
  });

  // Validar que el inventario no sea "Total"
  const isInventarioValido = inventarioSeleccionado !== 'Total';

  // Validar si las imágenes son válidas
  const hayImagenesValidas = currentProduct.images && currentProduct.images.some(img => img.url && img.url.trim() !== '');

  // Devuelve true solo si todos los campos están completos y el inventario es válido y hay imágenes válidas
  return Boolean(allFieldsFilled && isInventarioValido && hayImagenesValidas);
};


  const scrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Cargar inventarios disponibles
  useEffect(() => {
    const cargarInventarios = async () => {
      if (isNewProduct) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/inventario`);
          const adaptados = (response.data as any[]).map((inv: any) => ({ // Afirmamos el tipo
            id: inv.id,
            nombre: inv.ubicacion,
          }));
          setInventariosDB(adaptados);
        } catch (error) {
          console.error("Error al obtener inventarios disponibles", error);
        }
      } else {
        if (!currentProduct?.id) return;
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/inventario/producto/${currentProduct.id}`);
          const inventarios = response.data as any[]; // Afirmamos el tipo
          const adaptados = inventarios.map((inv: any) => ({
            id: inv.id_inventario,
            nombre: inv.ubicacion,
            stock: inv.stock,
          }));
          setInventariosDB(adaptados);
          setCurrentProduct(prev => ({
            ...prev,
            id_inventario: -1, // Total
          }));
        } catch (error) {
          console.error("Error cargando inventarios del producto", error);
        }
      }
    };
    cargarInventarios();
  }, [currentProduct?.id, isNewProduct, setCurrentProduct]);

  // Actualizar el stock basado en el inventario seleccionado
  useEffect(() => {
    if (inventarioSeleccionado === "Total") {
      const totalStock = inventariosDB.reduce((sum, inv) => sum + (inv.stock || 0), 0);
      setCurrentProduct(prev => ({
        ...prev,
        stock: totalStock,
        id_inventario: -1, // Usamos -1 para indicar "Total"
      }));
    } else {
      const inventario = inventariosDB.find(inv => inv.nombre === inventarioSeleccionado);
      setCurrentProduct(prev => ({
        ...prev,
        stock: inventario?.stock || 0,
        id_inventario: inventario?.id ?? null,
      }));
    }
  }, [inventarioSeleccionado, inventariosDB, setCurrentProduct]);

  // Cargar marcas disponibles
  useEffect(() => {
    const cargarMarcas = async () => {
      const marcas = await obtenerMarcasDisponibleApi();
      setMarcasDisponibles(marcas);
    };
    cargarMarcas();
  }, []);

  // Cargar modelos basados en la marca seleccionada
  useEffect(() => {
    const cargarModelos = async () => {
      if (currentProduct.brand) {
        const marcaSeleccionada = marcasDisponibles.find(
          (m) => m.nombre === currentProduct.brand
        );
        if (marcaSeleccionada) {
          const modelosData = await obtenerModelosPorMarca(marcaSeleccionada.id);
          setModelos(modelosData as { id: number; nombre: string }[]); // Afirmamos el tipo
        } else {
          setModelos([]);
        }
      } else {
        setModelos([]);
      }
    };
    cargarModelos();
  }, [currentProduct.brand, marcasDisponibles]);

  // Manejo de imágenes
  const handleImageChange = (index: number, newUrl: string) => {
    const newImages = currentProduct.images ? [...currentProduct.images] : [];
    newImages[index] = { ...newImages[index], url: newUrl };
    setCurrentProduct({ ...currentProduct, images: newImages });
  };

  const handleAddImage = () => {
    const newImages = currentProduct.images ? [...currentProduct.images] : [];
    newImages.push({ url: '', orden: newImages.length + 1 });
    setCurrentProduct({ ...currentProduct, images: newImages });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = currentProduct.images ? [...currentProduct.images] : [];
    newImages.splice(index, 1);
    const reordenadas = newImages.map((img, i) => ({ ...img, orden: i + 1 }));
    setCurrentProduct({ ...currentProduct, images: reordenadas });
  };

  if (!isEditing && !isNewProduct) return null;

  return (
    <div ref={topRef} className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Editar Producto" : "Agregar Nuevo Producto"}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductDetailsFields
          currentProduct={currentProduct}
          setCurrentProduct={setCurrentProduct}
          modelos={modelos}
          marcasDisponibles={marcasDisponibles}
          inventarioSeleccionado={inventarioSeleccionado}
          setInventarioSeleccionado={setInventarioSeleccionado}
          inventariosDB={inventariosDB}
        />

        <ProductImageManager
          images={currentProduct.images || []}
          onImageChange={handleImageChange}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
        />

        {(isEditing || isNewProduct) && (
          <ProductFormActions
            isLoading={isLoading}
            isNewProduct={isNewProduct}
            resetForm={resetForm}
            scrollToTop={scrollToTop}
            isFormInvalid={!isFormValid()} // Validación invertida
          />
        )}
      </form>
    </div>
  );
};

export default ProductForm;
