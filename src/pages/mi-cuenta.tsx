'use client';

import { AuthContext } from '../context/AuthContext';
import { useContext, useState, useEffect, useCallback } from 'react';

interface ShippingAddress {
  id: number;
  nombre?: string;
  apellido?: string;
  direccion: string;
  telefono: string;
  cedula?: string;
  ciudad: string;
  provincia: string;
  es_principal: boolean;
}

const ShippingAddressesPage = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);

  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [formData, setFormData] = useState<Partial<ShippingAddress>>({
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    cedula: '',
    ciudad: '',
    provincia: '',
    es_principal: false,
  });

  const userId = user?.id;

  // Mover fetchAddresses dentro de useCallback para evitar warnings de dependencias
  const fetchAddresses = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/usuarios/${userId}/direccion-envio`);
      if (!res.ok) throw new Error('Error al cargar direcciones');
      const data = await res.json();
      setAddresses(data);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && userId) {
      fetchAddresses();
    }
  }, [mounted, userId, fetchAddresses]);

  if (!mounted) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <p>Por favor inicia sesión para ver tus direcciones.</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isChecked = e.target instanceof HTMLInputElement ? e.target.checked : false;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? isChecked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
      cedula: '',
      ciudad: '',
      provincia: '',
      es_principal: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.direccion || !formData.telefono || !formData.ciudad || !formData.provincia) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    try {
      const method = editingAddress ? 'PUT' : 'POST';
      const url = editingAddress
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/direccion-envio/${editingAddress.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/usuarios/${userId}/direccion-envio`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error en la operación');
      }

      await fetchAddresses();
      setEditingAddress(null);
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Error desconocido');
    }
  };

  const startEditing = (address: ShippingAddress) => {
    setEditingAddress(address);
    setFormData(address);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar esta dirección?')) return;

    try {
      const addressToDelete = addresses.find(addr => addr.id === id);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/direccion-envio/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar dirección');

      // Actualizar lista
      await fetchAddresses();

      if (addressToDelete?.es_principal) {
        const updatedAddresses = addresses.filter(addr => addr.id !== id);
        if (updatedAddresses.length > 0) {
          const newPrincipal = updatedAddresses[0];

          const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/direccion-envio/${newPrincipal.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...newPrincipal,
              nombre: newPrincipal.nombre || '',
              apellido: newPrincipal.apellido || '',
              direccion: newPrincipal.direccion,
              telefono: newPrincipal.telefono,
              cedula: newPrincipal.cedula || '',
              ciudad: newPrincipal.ciudad,
              provincia: newPrincipal.provincia,
              es_principal: true,
            }),
          });

          if (!updateRes.ok) {
            const err = await updateRes.json();
            console.error('Error al actualizar principal:', err);
            throw new Error(err.error || 'Error al asignar nueva dirección principal');
          }

          // Recargar direcciones con principal actualizado
          await fetchAddresses();
        }
      }
    } catch (err: any) {
      alert(err.message || 'Error desconocido');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      {/* resto del JSX igual */}
    </div>
  );
};

export default ShippingAddressesPage;
