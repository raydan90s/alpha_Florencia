"use client";
import { FaShoppingCart, FaWhatsapp, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import { useCart } from "../../../../context/CartContext"; // Ejemplo: usa contexto para agregar al carrito
import type { ProductoAgregar } from "../../../../types/carContext";

interface ProductActionsProps {
  productId: number;
  productName: string;
  stock: number;
  price: number;
  images: { url: string }[];
}

export default function ProductActions({
  productId,
  productName,
  stock,
  price,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { agregarAlCarrito } = useCart();

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase" && quantity < stock) {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const isAddToCartDisabled = stock === 0 || quantity > stock || added;

  const handleAddToCartClick = () => {
    const producto: ProductoAgregar = {
      id: productId,
      name: productName,
      precio: price,
      cantidad: quantity,
      images: Image,
    };
    agregarAlCarrito(producto);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const handleChatWithAdvisor = () => {
    window.open(
      `https://wa.me/YOUR_PHONE_NUMBER?text=Hola,%20quisiera%20saber%20más%20sobre%20el%20producto:%20${encodeURIComponent(productId)}`,
      "_blank"
    );
  };

  return (
    <div className="mb-6 p-4">
      <div className="flex items-center mb-4 gap-4">
        {/* Selector de cantidad */}
        <div className="flex items-center rounded-md overflow-hidden border-2 border-[#003366]">
          <input
            type="text"
            value={quantity}
            readOnly
            className="w-12 text-center py-2 font-semibold bg-[#FCF8E6] text-[#1A1A1A] focus:outline-none"
          />
          <div className="flex flex-col">
            <button
              onClick={() => handleQuantityChange("increase")}
              disabled={quantity >= stock}
              className={`px-3 py-1 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 ${quantity >= stock ? "bg-gray-300 text-[#FCF8E6]" : "bg-[#003366] text-[#FCF8E6] border-b border-[#FCF8E6]"
                }`}
            >
              <FaChevronUp className="text-sm" />
            </button>
            <button
              onClick={() => handleQuantityChange("decrease")}
              disabled={quantity <= 1}
              className={`px-3 py-1 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 ${quantity <= 1 ? "bg-gray-300 text-[#FCF8E6]" : "bg-[#003366] text-[#FCF8E6]"
                }`}
            >
              <FaChevronDown className="text-sm" />
            </button>
          </div>
        </div>

        {/* Botón Añadir al carrito */}
        <button
          onClick={handleAddToCartClick}
          disabled={isAddToCartDisabled}
          className={`ml-4 flex-1 py-3 px-6 rounded-lg transition duration-200 font-bold flex items-center justify-center text-lg hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed shadow-md ${isAddToCartDisabled ? "bg-gray-300 text-gray-600" : "bg-[#F8860D] text-[#FCF8E6]"
            }`}
        >
          <FaShoppingCart className="mr-2" />
          {added ? "¡Agregado!" : "Añadir al carrito"}
        </button>
      </div>

      {/* Botón WhatsApp */}
      <button
        onClick={handleChatWithAdvisor}
        className="w-full py-3 px-4 rounded-lg bg-green text-white hover:brightness-110 transition duration-200 flex items-center justify-center font-bold text-lg shadow-md"
      >
        <FaWhatsapp className="mr-2 text-xl" /> Chatee con un asesor
      </button>
    </div>
  );
}
