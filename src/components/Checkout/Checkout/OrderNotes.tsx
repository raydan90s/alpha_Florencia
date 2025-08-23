// components/Checkout/OrderNotes.tsx
import React from 'react';

interface OrderNotesProps {
  notas: string;
  handleNotasChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const OrderNotes = ({ notas, handleNotasChange }: OrderNotesProps) => {
  return (
    <div className="bg-white shadow rounded p-6">
      <label htmlFor="notes" className="block mb-2 font-medium">
        Notas del pedido (opcional)
      </label>
      <textarea
        id="notes"
        name="notas"
        rows={4}
        placeholder="Ej. instrucciones de entrega, referencias, etc..."
        className="w-full p-4 border rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-300"
        value={notas}
        onChange={handleNotasChange}
      />
    </div>
  );
};

export default OrderNotes;