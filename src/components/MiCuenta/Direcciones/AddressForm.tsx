import { useState } from 'react';
import type { DireccionEnvio } from '../../../types/direccionEnvio';

interface AddressFormProps {
  editingAddress: DireccionEnvio | null;
  onSubmit: (formData: Partial<DireccionEnvio>) => Promise<void>;
  onCancel: () => void;
}

const AddressForm = ({ editingAddress, onSubmit, onCancel }: AddressFormProps) => {
  const [formData, setFormData] = useState<Partial<DireccionEnvio>>({
    nombre: editingAddress?.nombre || '',
    apellido: editingAddress?.apellido || '',
    direccion: editingAddress?.direccion || '',
    telefono: editingAddress?.telefono || '',
    cedula: editingAddress?.cedula || '',
    ciudad: editingAddress?.ciudad || '',
    provincia: editingAddress?.provincia || '',
    pastcode: editingAddress?.pastcode || '',
    es_principal: editingAddress?.es_principal || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isChecked = e.target instanceof HTMLInputElement ? e.target.checked : false;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? isChecked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.direccion || !formData.telefono || !formData.ciudad || !formData.provincia) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-5 bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Dirección *</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Teléfono *</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cédula</label>
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Ciudad *</label>
          <input
            type="text"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Provincia *</label>
          <input
            type="text"
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Código Postal</label>
          <input
            type="text"
            name="pastcode" 
            value={formData.pastcode}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4 md:col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="es_principal"
              checked={formData.es_principal}
              onChange={handleChange}
              className="mr-2"
            />
            Dirección principal
          </label>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {editingAddress ? 'Actualizar Dirección' : 'Agregar Dirección'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AddressForm;