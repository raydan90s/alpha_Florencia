"use client";

interface ProductDetailsHeaderProps {
  name: string;
  price: number;
}

export default function ProductDetailsHeader({ name, price }: ProductDetailsHeaderProps) {
  // Función mejorada para dividir el nombre de manera más inteligente
  const formatProductName = (name: string) => {
    if (name.length > 30) {
      // Buscar espacios para dividir mejor
      const words = name.split(' ');
      
      if (words.length >= 2) {
        // Si hay al menos 2 palabras, tomar las primeras como título principal
        const firstTwoWords = words.slice(0, 2).join(' ');
        const remainingWords = words.slice(2).join(' ');
        
        return {
          mainTitle: firstTwoWords,
          subtitle: remainingWords || null
        };
      }
      
      // Si es una sola palabra muy larga (como códigos de productos)
      if (name.includes('MP') || name.includes('/')) {
        const parts = name.split(/(?=MP)|(?=\/)/);
        return {
          mainTitle: parts[0].trim(),
          subtitle: parts.slice(1).join('').trim()
        };
      }
    }
    
    return { mainTitle: name, subtitle: null };
  };

  const { mainTitle, subtitle } = formatProductName(name);

  return (
    <div className="mb-6 pb-6 border-b border-gray-300">
      <div className="flex flex-col items-center text-center space-y-3 animate-fade-in w-full">
        <div className="space-y-2 w-full max-w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight px-4 break-words word-wrap overflow-wrap-anywhere">
            {mainTitle}
          </h1>
          
          {subtitle && (
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-600 leading-tight px-4 break-all max-w-full">
              <span className="inline-block break-words overflow-wrap-anywhere font-mono tracking-tighter">
                {subtitle}
              </span>
            </h2>
          )}
        </div>

        <div className="pt-2">
          <span className="text-2xl md:text-3xl font-black text-[#003366] bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 animate-gradient-x">
            ${price.toFixed(2)} <span className="text-sm text-red-500 font-normal">+ IVA</span>
          </span>
        </div>
      </div>
    </div>
  );
}