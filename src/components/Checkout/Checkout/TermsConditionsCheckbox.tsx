// components/Checkout/TermsConditionsCheckbox.tsx
import React from 'react';

interface TermsConditionsCheckboxProps {
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
}

const TermsConditionsCheckbox: React.FC<TermsConditionsCheckboxProps> = ({ 
  termsAccepted, 
  onTermsChange 
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTermsChange(e.target.checked);
  };

  return (
    <div className="flex items-start mt-4 gap-3">
      <input
        type="checkbox"
        checked={termsAccepted}
        onChange={handleCheckboxChange}
        id="aceptaTerminos"
        className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1 shrink-0"
      />
      <label htmlFor="aceptaTerminos" className="text-gray-700 text-xs leading-relaxed">
        He leído y acepto los{" "}
        <a href="/terminos-condiciones" target="_blank" className="text-blue-600 underline">
          términos y condiciones
        </a>{" "}
        del sitio web. <span className="text-red-500 mr-1">*</span>
      </label>
    </div>
  );
};

export default TermsConditionsCheckbox;