
const steps = [
  { label: "Shopping Cart", path: "/carrito" },
  { label: "Shipping and Checkout", path: "/checkout" },
  { label: "Confirmation", path: "/confirmacion" },
];

type Props = {
  currentStep: number;
};

const CheckoutSteps = ({ currentStep }: Props) => {
  return (
    <div className="relative flex flex-col items-center max-w-4xl mx-auto px-4 sm:px-8 py-2 mb-12">
      {/* Línea completa detrás de los círculos */}
      <div className="absolute top-4 left-0 right-0 h-0.5 z-0">
        <div className="w-full h-full bg-[#d1d5db]">
          <div
            className="h-full bg-[#000000]"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Círculos */}
      <div className="flex justify-between items-center w-full z-10">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={index}
              className="relative flex flex-col items-center w-1/3"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                ${
                  isCompleted || isActive
                    ? "bg-[#111827] text-[#FFFFFF]"
                    : "bg-[#e5e7eb] text-[#000000]"
                }`}
              >
                {index + 1}
              </div>

              {/* Etiqueta debajo del círculo */}
              <span
                className={`mt-2 text-xs text-center ${
                  isCompleted || isActive
                    ? "font-semibold text-[#000000]"
                    : "text-[#000000]"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
