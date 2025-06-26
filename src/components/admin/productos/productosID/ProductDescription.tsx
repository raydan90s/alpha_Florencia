interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="mt-4 text-gray-700 text-lg leading-relaxed">
      {description}
    </div>
  );
}
