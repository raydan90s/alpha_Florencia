'use client';

import { AuthContext } from '../../../context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import type { DireccionEnvio } from '../../../types/direccionEnvio';
import { useAddresses } from '../../../hooks/useAddresses';
import AddressForm from './AddressForm';
import AddressList from './AddressList';

const ShippingAddressesSection = () => {
  const { user } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DireccionEnvio | null>(null);

  const userId = user?.id;
  const { addresses, loading, error, fetchAddresses, saveAddress, deleteAddress } = useAddresses(userId);

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, fetchAddresses]);

  const handleSubmitAddress = async (formData: Partial<DireccionEnvio>) => {
    try {
      await saveAddress(formData, editingAddress);
      setEditingAddress(null);
      setShowForm(false);
    } catch (err: any) {
      alert(err.message || 'Error desconocido');
    }
  };

  const handleEditAddress = (address: DireccionEnvio) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = async (id?: number) => {
    if (!confirm('¿Seguro que quieres eliminar esta dirección?')) return;
    
    try {
      await deleteAddress(id);
    } catch (err: any) {
      alert(err.message || 'Error desconocido');
    }
  };

  const handleCancelForm = () => {
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Direcciones de Envío</h2>
          <p className="text-gray-600 text-sm">Gestiona tus direcciones de entrega</p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNewAddress}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            + Nueva Dirección
          </button>
        )}
      </div>

      {showForm && (
        <AddressForm
          editingAddress={editingAddress}
          onSubmit={handleSubmitAddress}
          onCancel={handleCancelForm}
        />
      )}

      <AddressList
        addresses={addresses}
        onEdit={handleEditAddress}
        onDelete={handleDeleteAddress}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default ShippingAddressesSection;