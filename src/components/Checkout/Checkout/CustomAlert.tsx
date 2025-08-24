// components/Checkout/CustomAlert.tsx
interface CustomAlertProps {
  message: string;
  onClose: () => void;
  showCancelButton?: boolean;
  onCancel?: () => void;
}

const CustomAlert = ({ message, onClose, showCancelButton = false, onCancel }: CustomAlertProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
      <h3 className="font-bold text-lg text-red-600 mb-2">¡Atención!</h3>
      <p className="py-4">{message}</p>
      <div className="modal-action flex gap-2">
        {showCancelButton && onCancel && (
          <button 
            onClick={onCancel} 
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button 
          onClick={onClose} 
          className={`${showCancelButton ? 'flex-1' : 'w-full'} bg-[#FF6B00] text-white py-2 rounded-md hover:bg-[#FF8533] transition-colors`}
        >
          {showCancelButton ? 'Continuar' : 'Entendido'}
        </button>
      </div>
    </div>
  </div>
);

export default CustomAlert;