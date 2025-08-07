import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import type { Product } from "../../types/product";
import ErrorAlert from "../../components/Common/ErrorAlert";
import ProductForm from "../../components/admin/productos/ProductForm";
import ProductsList from "../../components/admin/productos/ProductsList";
import { AuthContext } from "../../context/AuthContext";
import { usePermissions } from "../../context/PermissionContext";
import SortDropdown from "../../components/admin/productos/SortDropdown";
import Sidebar from "../../components/admin/Sidebar";
import BrandManager from "../../components/admin/marcas/brand";
import ModelManager from "../../components/admin/modelos/modelos";
import InventoryManager from "../../components/admin/inventario/inventory";
import SettingManager from "../../components/admin/configuracion/setting";
import HistorialManager from "../../components/admin/historial_ventas/HistorialManager";

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

  // TODOS los hooks aquí arriba, sin condicionales
  const { products, setProducts } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    brand: "",
    model: "",
    stock: 0,
    image: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [, setSuccessMessage] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("productos");
  const { isAuthenticated, user } = useContext(AuthContext);
  const { permissions } = usePermissions();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hasPermission = (permiso: string) => permissions?.includes(permiso);

  useEffect(() => {
    if (!isClient) return;

    if (!user) {
      // Usuario no autenticado
      navigate("/admin/login"); // Redirecciona si no es admin
      return;
    }

    if (!isAuthenticated || (user.tipo !== "Admin" && user.tipo !== "SuperAdmin")) {
      navigate("/admin/login"); // Redirecciona si no es admin
    } else {
      setLoading(false);
    }
  }, [isClient, isAuthenticated, user, navigate]);

  if (!isClient || loading) {
    return <p className="text-center mt-10">Cargando...</p>;
  }

  // --- Resto del código de handlers y render ---

  const scrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const url = isNewProduct
        ? `${import.meta.env.VITE_API_BASE_URL}/api/productos`
        : `${import.meta.env.VITE_API_BASE_URL}/api/productos/${editingId}`;

      const method = isNewProduct ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentProduct),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar el producto");
      }

      const responseData = await response.json();
      const savedProduct = Array.isArray(responseData)
        ? responseData.find((p) => p.id)
        : responseData;

      if (isNewProduct) {
        setProducts((prev) => [...prev, savedProduct]);
      } else {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? savedProduct : p))
        );
      }

      resetForm();
      scrollToTop();
      setSuccessMessage("Producto actualizado correctamente");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewProductClick = () => {
    setIsNewProduct(true);
    setIsEditing(true);
    setEditingId(null);
    setCurrentProduct({
      name: "",
      description: "",
      price: 0,
      brand: "",
      model: "",
      stock: 0,
      image: "",
    });
  };

  const cancelNewProduct = () => {
    setIsNewProduct(false);
    setIsEditing(false);
    setEditingId(null);
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setIsNewProduct(false);

    setCurrentProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      model: product.model,
      stock: product.stock || 0,
      image: product.images?.[0]?.url || "",
      images: product.images ?? [],
    });
  };

  const handleDelete = async (id: string | number) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/productos/${id}/inactivar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: "Inactivo" } : p))
      );
    } catch (error) {
      console.error("Error al inactivar el producto:", error);
    }
  };

  const handleActive = async (id: string | number) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/productos/${id}/activar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: "Activo" } : p))
      );
    } catch (error) {
      console.error("Error al activar el producto:", error);
    }
  };

  const resetForm = () => {
    setCurrentProduct({});
    setIsEditing(false);
    setIsNewProduct(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div ref={topRef} />

      <Sidebar
        selectedSection={selectedSection}
        onSelect={setSelectedSection}
        hasPermission={hasPermission}
      />

      <main className="flex-1 py-4 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <ErrorAlert message={error} />

        {/* Productos */}
        {selectedSection === "productos" && (
          hasPermission("ver_productos") ? (
            <>
              {(isEditing || isNewProduct) && (
                <ProductForm
                  isNewProduct={isNewProduct}
                  currentProduct={currentProduct}
                  setCurrentProduct={setCurrentProduct}
                  handleSubmit={handleSubmit}
                  isEditing={isEditing}
                  isLoading={isLoading}
                  resetForm={resetForm}
                  productos={products}
                />
              )}
              <div className="flex justify-between items-center mb-4">
                <div className="w-full md:w-1/2">
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <SortDropdown />
              </div>
              <ProductsList
                searchTerm={searchTerm}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                isLoading={isLoading}
                handleActive={handleActive}
                handleNewProduct={handleNewProductClick}
                isNewProduct={isNewProduct}
                cancelNewProduct={cancelNewProduct}
              />
            </>
          ) : (
            <p className="text-red-600 font-semibold">No tienes acceso a productos.</p>
          )
        )}

        {/* Marcas */}
        {selectedSection === "marcas" && (
          hasPermission("ver_marcas") ? (
            <BrandManager />
          ) : (
            <p className="text-red-600 font-semibold">No tienes acceso a marcas.</p>
          )
        )}

        {/* Modelos */}
        {selectedSection === "modelos" && (
          hasPermission("ver_modelos") ? (
            <ModelManager />
          ) : (
            <p className="text-red-600 font-semibold">No tienes acceso a modelos.</p>
          )
        )}

        {/* Inventario */}
        {selectedSection === "inventario" && (
          hasPermission("ver_inventario") ? (
            <InventoryManager />
          ) : (
            <p className="text-red-600 font-semibold">No tienes acceso a inventario.</p>
          )
        )}

        {/* Configuración */}
        {selectedSection === "config" && (
          hasPermission("ver_configuracion") ? (
            <SettingManager />
          ) : (
            <p className="text-red-600 font-semibold">No tienes acceso a configuración.</p>
          )
        )}

        {/* Historial */}
        {selectedSection === "historial" && (
          hasPermission("ver_historial_ventas") ? (
            <HistorialManager />
          ) : (
            <p className="text-red-600 font-semibold">No tienes acceso al historial de ventas.</p>
          )
        )}
      </main>
    </div>
  );
}
