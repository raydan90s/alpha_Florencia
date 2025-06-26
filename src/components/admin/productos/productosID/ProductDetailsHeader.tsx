"use client";

interface ProductDetailsHeaderProps {
  name: string;
  price: number;
}

export default function ProductDetailsHeader({ name, price }: ProductDetailsHeaderProps) {
  return (
    <div className="mb-10 pb-8 border-b border-gray-300">
      <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
          {name}
        </h1>

        <span className="text-xl md:text-3xl font-black text-[#003366] bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 animate-gradient-x">
          ${price.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
