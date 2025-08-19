import React from "react";

interface ShippingFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const ShippingField: React.FC<ShippingFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  placeholder,
  error,
  required,
  disabled,
  onChange,
  onBlur,
}) => {
  return (
    <div className="mb-5">
      <label className="block mb-2.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full py-2.5 px-5 border rounded bg-gray-1 outline-none ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default ShippingField;
