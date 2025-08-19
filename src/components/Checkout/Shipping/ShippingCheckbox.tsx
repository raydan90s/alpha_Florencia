import React from "react";

interface ShippingCheckboxProps {
  id?: string;
  name: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ShippingCheckbox: React.FC<ShippingCheckboxProps> = ({
  id,
  name,
  label,
  checked,
  disabled,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2 mb-5">
      <input
        id={id ?? name}
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded"
      />
      <label htmlFor={id ?? name} className="text-sm text-slate-700">
        {label}
      </label>
    </div>
  );
};

export default ShippingCheckbox;
