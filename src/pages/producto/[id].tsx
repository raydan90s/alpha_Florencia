// pages/productos/[id].tsx
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import ProductImageGallery from "@/components/admin/productos/productosID/ProductImageGallery";
import ProductDetailsHeader from "@/components/admin/productos/productosID/ProductDetailsHeader";
import ProductAvailability from "@/components/admin/productos/productosID/ProductAvailability";
import ProductActions from "@/components/admin/productos/productosID/ProductActions";
import ShippingInfo from "@/components/admin/productos/productosID/ShippingInfo";
import PaymentMethods from "@/components/admin/productos/productosID/PaymentMethods";
import RelatedProductsByBrand from "@/components/admin/productos/productosID/RelatedProductsByBrand";
import ProductDescription from "@/components/admin/productos/productosID/ProductDescription";
import { Product } from "@/types/product";

interface Props {
  producto: Product;
}

export default function DetalleProductoPage({ producto }: Props) {
  const router = useRouter();

  // No debería entrar aquí con fallback: false, pero se deja por seguridad
  if (router.isFallback) {
    return <div>Cargando producto...</div>;
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
      <div className="mt-12 rounded-lg p-6 shadow-inner" style={{ backgroundColor: "#FCF8E6" }}>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: "#1A1A1A" }}>
          Información Técnica
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" style={{ color: "#1A1A1A" }}>
          <p><strong>Tipo:</strong> {producto.category}</p>
          <p><strong>Modelo:</strong> {producto.model}</p>
          <p><strong>Marca:</strong> {producto.brand}</p>
        </div>
      </div>
      <div className="mt-16">
        <RelatedProductsByBrand currentProduct={producto} maxProducts={4} />
      </div>
    </div>
  );
}

// ✅ Solo se permiten rutas conocidas si usas `next export`
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/productos-con-imagenes`);
    if (!res.ok) throw new Error("Failed to fetch products");

    const productos: Product[] = await res.json();

    const paths = productos.map((producto) => ({
      params: { id: producto.id.toString() },
    }));

    return {
      paths,
      fallback: false, // ❗IMPORTANTE para exportación estática
    };
  } catch (error) {
    console.error("Error en getStaticPaths:", error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;
  if (!id || typeof id !== "string") return { notFound: true };

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/productos/por/${id}`);
    if (!res.ok) return { notFound: true };

    const producto: Product = await res.json();
    if (!producto) return { notFound: true };

    return {
      props: { producto },
    };
  } catch (error) {
    console.error("Error en getStaticProps:", error);
    return { notFound: true };
  }
};
