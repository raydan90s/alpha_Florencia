import { useState, useCallback } from 'react';
import type { DireccionEnvio } from '../types/direccionEnvio';

export const useAddresses = (userId?: number) => {
  const [addresses, setAddresses] = useState<DireccionEnvio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/${userId}/direccion-envio`, {
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY,
        }
      });
      if (!res.ok) throw new Error('Error al cargar direcciones');
      const data = await res.json();

      const mapped = data.map((addr: any) => ({
        ...addr,
        pastcode: addr.postal,
      }));

      setAddresses(mapped);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const saveAddress = async (formData: Partial<DireccionEnvio>, editingAddress: DireccionEnvio | null) => {
    if (!userId) return;

    try {
      const method = editingAddress ? 'PUT' : 'POST';
      const url = editingAddress
        ? `${import.meta.env.VITE_API_BASE_URL}/api/direccion-envio/${editingAddress.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/usuarios/${userId}/direccion-envio`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error en la operación');
      }

      await fetchAddresses();
    } catch (err: any) {
      throw new Error(err.message || 'Error desconocido');
    }
  };

  const deleteAddress = async (id?: number) => {
    if (id === undefined) {
      throw new Error('ID de dirección inválido');
    }

    try {
      const addressToDelete = addresses.find(addr => addr.id === id);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/direccion-envio/${id}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY,
        }
      });
      if (!res.ok) throw new Error('Error al eliminar dirección');

      // Si la dirección eliminada era principal, asignar principal a la primera disponible
      if (addressToDelete?.es_principal) {
        const updatedAddresses = addresses.filter(addr => addr.id !== id);
        if (updatedAddresses.length > 0) {
          const newPrincipal = updatedAddresses[0];

          const updateRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/direccion-envio/${newPrincipal.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': import.meta.env.VITE_API_KEY,
            },
            body: JSON.stringify({
              ...newPrincipal,
              nombre: newPrincipal.nombre || '',
              apellido: newPrincipal.apellido || '',
              direccion: newPrincipal.direccion,
              telefono: newPrincipal.telefono,
              cedula: newPrincipal.cedula || '',
              ciudad: newPrincipal.ciudad,
              provincia: newPrincipal.provincia,
              pastcode: newPrincipal.pastcode,
              es_principal: true,
            }),
          });

          if (!updateRes.ok) {
            const err = await updateRes.json();
            console.error('Error al actualizar principal:', err);
            throw new Error(err.error || 'Error al asignar nueva dirección principal');
          }
        }
      }

      await fetchAddresses();
    } catch (err: any) {
      throw new Error(err.message || 'Error desconocido');
    }
  };

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    saveAddress,
    deleteAddress,
  };
};