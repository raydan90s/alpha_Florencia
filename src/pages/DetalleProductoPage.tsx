import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // si usas react-router
import ProductImageGallery from "../components/admin/productos/productosID/ProductImageGallery";
import ProductDetailsHeader from "../components/admin/productos/productosID/ProductDetailsHeader";
import ProductAvailability from "../components/admin/productos/productosID/ProductAvailability";
import ProductActions from "../components/admin/productos/productosID/ProductActions";
import ShippingInfo from "../components/admin/productos/productosID/ShippingInfo";
import PaymentMethods from "../components/admin/productos/productosID/PaymentMethods";
import RelatedProductsByBrand from "../components/admin/productos/productosID/RelatedProductsByBrand";
import ProductDescription from "../components/admin/productos/productosID/ProductDescription";
import type { Product } from "../types/product";

export default function DetalleProductoPage() {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/productos/por/${id}`)
      .then((res) => res.ok ? res.json() : Promise.reject("Error al cargar"))
      .then((data: Product) => setProducto(data))
      .catch((err) => {
        console.error(err);
        setProducto(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div>Cargando producto...</div>;
  }

  if (!producto) {
    return <div>No se encontró el producto</div>;
  }

  const imageUrls =
    producto.images?.map((img) => img.url) ?? [
      "https://via.placeholder.com/400x300/FCF8E6/1A1A1A?text=Sin+Imagen",
    ];

  const handleChatWithAdvisor = () => {
    window.open(
      `https://wa.me/YOUR_PHONE_NUMBER?text=Hola,%20quisiera%20saber%20más%20sobre%20el%20producto:%20${encodeURIComponent(
        producto.name
      )}`,
      "_blank"
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[500px] h-full">
        <div className="lg:w-1/2 h-full">
          <ProductImageGallery imageUrls={imageUrls} altText={producto.name} />
        </div>
        <div className="lg:w-1/2 h-full rounded-xl shadow-md p-4 space-y-4">
          <ProductDetailsHeader name={producto.name} price={producto.price} />
          <ProductDescription description={producto.description} />
          <ProductAvailability stock={producto.stock} />
          <ProductActions
            stock={producto.stock}
            productName={producto.name}
            productId={producto.id}
            price={producto.price}
            images={producto.images}
          />
          <ShippingInfo />
          <PaymentMethods />
        </div>
      </div>
      <div
        className="mt-12 rounded-lg p-6 shadow-inner"
        style={{ backgroundColor: "#FCF8E6" }}
      >
        <h2 className="text-2xl font-semibold mb-4" style={{ color: "#1A1A1A" }}>
          Información Técnica
        </h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"
          style={{ color: "#1A1A1A" }}
        >
          <p>
            <strong>Tipo:</strong> {producto.category}
          </p>
          <p>
            <strong>Modelo:</strong> {producto.model}
          </p>
          <p>
            <strong>Marca:</strong> {producto.brand}
          </p>
        </div>
      </div>
      <div className="mt-16">
        <RelatedProductsByBrand currentProduct={producto} maxProducts={4} />
      </div>
    </div>
  );
}
