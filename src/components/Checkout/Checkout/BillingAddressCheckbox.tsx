// components/Checkout/BillingAddressCheckbox.tsx
interface BillingAddressCheckboxProps {
  usarMismosDatos: boolean;
  setUsarMismosDatos: (value: boolean) => void;
}

const BillingAddressCheckbox = ({ 
  usarMismosDatos, 
  setUsarMismosDatos 
}: BillingAddressCheckboxProps) => {
  return (
    <div className="bg-white shadow rounded p-6">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={usarMismosDatos}
          onChange={() => setUsarMismosDatos(!usarMismosDatos)}
          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-gray-700 font-medium">
          Usar los mismos datos de envío para facturación
        </span>
      </label>
    </div>
  );
};

export default BillingAddressCheckbox;