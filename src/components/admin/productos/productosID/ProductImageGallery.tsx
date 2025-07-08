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

  const handleThumbnailPrev = () => {
    if (isSingleImage) return;
    handlePrev();
  };

  const handleThumbnailNext = () => {
    if (isSingleImage) return;
    handleNext();
  };

  useEffect(() => {
    if (isSingleImage) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [handleNext, isSingleImage]);

  // Función para obtener las imágenes visibles en el carrusel
  const getVisibleThumbnails = () => {
    if (imageUrls.length <= 3) return imageUrls;
    
    const visibleCount = 3;
    const totalImages = imageUrls.length;
    const halfVisible = Math.floor(visibleCount / 2);
    
    let startIndex = currentIndex - halfVisible;
    let endIndex = currentIndex + halfVisible;
    
    // Ajustar índices para manejo circular
    if (startIndex < 0) {
      startIndex = totalImages + startIndex;
      endIndex = startIndex + visibleCount - 1;
    } else if (endIndex >= totalImages) {
      endIndex = endIndex - totalImages;
      startIndex = endIndex - visibleCount + 1;
      if (startIndex < 0) startIndex = totalImages + startIndex;
    }
    
    const visibleImages = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (startIndex + i) % totalImages;
      visibleImages.push({ url: imageUrls[index], originalIndex: index });
    }
    
    return visibleImages;
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-4 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg">
      {/* Imagen principal */}
      <div className="relative w-full h-[560px] flex justify-center items-center bg-white rounded-2xl overflow-hidden">
        {imageUrls.length > 0 ? (
          <>
            <div
              className={`relative w-full h-full transition-opacity duration-500 ease-in-out ${fade ? "opacity-100" : "opacity-0"}`}
            >
              <img
                src={imageUrls[currentIndex]}
                alt={altText}
                className="object-contain w-full h-full"
                loading={currentIndex === 0 ? "eager" : "lazy"}
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

      {/* Carrusel de miniaturas horizontal */}
      {!isSingleImage && (
        <div className="flex items-center justify-center gap-4">
          {/* Flecha izquierda */}
          <button
            onClick={handleThumbnailPrev}
            className="bg-white/80 backdrop-blur-md text-gray-600 hover:bg-blue-500 hover:text-white p-2 rounded-full shadow-md transition-all duration-200"
            aria-label="Anterior miniatura"
          >
            <FaChevronLeft size={16} />
          </button>

          {/* Contenedor de miniaturas */}
          <div className="flex items-center gap-3">
            {getVisibleThumbnails().map((item, index) => {
              const isActive = typeof item === 'object' ? item.originalIndex === currentIndex : false;
              const imageUrl = typeof item === 'object' ? item.url : item;
              const originalIndex = typeof item === 'object' ? item.originalIndex : index;
              
              return (
                <div
                  key={originalIndex}
                  onClick={() => handleThumbnailClick(originalIndex)}
                  className={`cursor-pointer transition-all duration-300 transform ${
                    isActive ? 'scale-110' : 'scale-100 hover:scale-105'
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`Miniatura ${originalIndex + 1}`}
                    className={`rounded-lg object-cover border-3 transition-all duration-300 shadow-md ${
                      isActive
                        ? "border-blue-500 ring-2 ring-blue-300 grayscale-0"
                        : "border-transparent grayscale hover:grayscale-0 hover:border-gray-300"
                    }`}
                    width={80}
                    height={80}
                  />
                </div>
              );
            })}
          </div>

          {/* Flecha derecha */}
          <button
            onClick={handleThumbnailNext}
            className="bg-white/80 backdrop-blur-md text-gray-600 hover:bg-blue-500 hover:text-white p-2 rounded-full shadow-md transition-all duration-200"
            aria-label="Siguiente miniatura"
          >
            <FaChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}