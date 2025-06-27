"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect, useRef, useCallback } from "react";

interface ProductImageGalleryProps {
  imageUrls: string[];
  altText: string;
}

export default function ProductImageGallery({
  imageUrls,
  altText,
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const isSingleImage = imageUrls.length === 1;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChangeIndex = (newIndex: number) => {
    setFade(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex(newIndex);
      setFade(true);
    }, 200);
  };

  const handlePrev = () => {
    if (isSingleImage) return;
    handleChangeIndex(currentIndex === 0 ? imageUrls.length - 1 : currentIndex - 1);
  };

  const handleNext = useCallback(() => {
    if (isSingleImage) return;
    handleChangeIndex(currentIndex === imageUrls.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, imageUrls.length, isSingleImage]);

  const handleThumbnailClick = (index: number) => {
    if (index === currentIndex) return;
    handleChangeIndex(index);
  };

  useEffect(() => {
    if (isSingleImage) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [handleNext, isSingleImage]);

  return (
    <div className="w-full h-full flex flex-col justify-between gap-6 p-4 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg">
      {/* Imagen principal */}
      <div className="relative w-full h-[500px] flex justify-center items-center bg-white rounded-2xl overflow-hidden">
        {imageUrls.length > 0 ? (
          <>
            <div
              className={`relative w-full h-full transition-opacity duration-500 ease-in-out ${
                fade ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Usamos la etiqueta <img> estándar para Vite */}
              <img
                src={imageUrls[currentIndex]}
                alt={altText}
                className="object-contain w-full h-full"
                loading={currentIndex === 0 ? "eager" : "lazy"} // Usamos eager para la primera imagen y lazy para las demás
              />
            </div>

            {!isSingleImage && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 backdrop-blur-md text-gray-800 hover:bg-blue-500 hover:text-white p-3 rounded-full shadow-md z-10 transition"
                  aria-label="Anterior"
                >
                  <FaChevronLeft size={26} />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 backdrop-blur-md text-gray-800 hover:bg-blue-500 hover:text-white p-3 rounded-full shadow-md z-10 transition"
                  aria-label="Siguiente"
                >
                  <FaChevronRight size={26} />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="bg-gray-100 flex items-center justify-center h-full w-full rounded-xl">
            <span className="text-gray-400">No hay imágenes disponibles</span>
          </div>
        )}
      </div>

      {/* Carrusel de miniaturas */}
      {!isSingleImage && (
        <div className="flex gap-4 flex-wrap justify-center items-center">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className="cursor-pointer transition-transform"
            >
              <img
                src={url}
                alt={`Miniatura ${index + 1}`}
                width={160}
                height={160}
                className={`rounded-xl object-cover border-4 transition-all duration-300 shadow-md 
                ${
                  currentIndex === index
                    ? "border-blue-500 grayscale-0"
                    : "border-transparent grayscale hover:grayscale-0 hover:border-gray-300"
                }`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
