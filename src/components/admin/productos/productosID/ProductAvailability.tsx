interface ProductAvailabilityProps {
  stock: number;
}

export default function ProductAvailability({ stock }: ProductAvailabilityProps) {
  return (
    <div>
      {stock > 0 ? (
        <span className="text-green-600 font-semibold">En Stock ({stock})</span>
      ) : (
        <span className="text-red-600 font-semibold">Agotado</span>
      )}
    </div>
  );
}
