// En el archivo ShippingAddressesPage.tsx
'use client';

import { AuthContext } from '../context/AuthContext';
import { useContext, useState, useEffect, useCallback } from 'react';
import type { DireccionEnvio } from '../types/direccionEnvio';
import Link from 'next/link'; // Importa Link

// Definición de tipos para los datos del pedido
interface Pedido {
    id: number;
    numero_pedido: string;
    fecha_pedido: string;
    total: string;
    estado_pago: string;
    estado_envio: string;
}

const ShippingAddressesPage = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [addresses, setAddresses] = useState<DireccionEnvio[]>([]);

    const [editingAddress, setEditingAddress] = useState<DireccionEnvio | null>(null);
    const [formData, setFormData] = useState<Partial<DireccionEnvio>>({
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

    const fetchAddresses = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/${userId}/direccion-envio`);
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

    // Lógica para Historial de Pedidos
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loadingPedidos, setLoadingPedidos] = useState(true);
    const [errorPedidos, setErrorPedidos] = useState<string | null>(null);

    const fetchPedidos = useCallback(async () => {
        if (!userId) return;
        setLoadingPedidos(true);
        setErrorPedidos(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/historial-pedidos?id_usuario=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al cargar el historial de pedidos.');
            }
            const data = await res.json();
            setPedidos(data);
        } catch (err: any) {
            console.error('Error fetching order history:', err);
            setErrorPedidos(err.message);
        } finally {
            setLoadingPedidos(false);
        }
    }, [userId]);

    useEffect(() => {
        if (mounted && userId) {
            fetchAddresses();
            fetchPedidos();
        }
    }, [mounted, userId, fetchAddresses, fetchPedidos]);

    // ... (el resto de tu código para handleChange, handleSubmit, startEditing, handleDelete)
    // No hace falta copiarlo de nuevo, ya lo tienes.

    if (!mounted) {
        return <p>Cargando...</p>;
    }

    if (!user) {
        return <p>Por favor inicia sesión para ver tus datos.</p>;
    }

    // --- Resto de la lógica y renderizado aquí ---

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
                ? `${import.meta.env.VITE_API_BASE_URL}/api/direccion-envio/${editingAddress.id}`
                : `${import.meta.env.VITE_API_BASE_URL}/api/usuarios/${userId}/direccion-envio`;

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

    const startEditing = (address: DireccionEnvio) => {
        setEditingAddress(address);
        setFormData(address);
        setShowForm(true);
    };

    const handleDelete = async (id?: number) => {
        if (id === undefined) {
            alert('ID de dirección inválido');
            return;
        }
        if (!confirm('¿Seguro que quieres eliminar esta dirección?')) return;

        try {
            const addressToDelete = addresses.find(addr => addr.id === id);

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/direccion-envio/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar dirección');

            await fetchAddresses();

            if (addressToDelete?.es_principal) {
                const updatedAddresses = addresses.filter(addr => addr.id !== id);
                if (updatedAddresses.length > 0) {
                    const newPrincipal = updatedAddresses[0];

                    const updateRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/direccion-envio/${newPrincipal.id}`, {
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

                    await fetchAddresses();
                }
            }
        } catch (err: any) {
            alert(err.message || 'Error desconocido');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-5">
            {/* Sección de Direcciones de Envío */}
            <h1 className="text-2xl font-semibold mb-5">Mis Direcciones de Envío</h1>
            {showForm && (
                // ... (tu formulario aquí, no cambia)
                <form onSubmit={handleSubmit} className="mb-5">
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
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Dirección</label>
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
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
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
                        <label className="block text-sm font-medium text-gray-700">Ciudad</label>
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
                        <label className="block text-sm font-medium text-gray-700">Provincia</label>
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
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                        {editingAddress ? 'Actualizar Dirección' : 'Agregar Dirección'}
                    </button>
                </form>
            )}
            <div>
                {loading && <p>Cargando direcciones...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {addresses.length === 0 && !loading && <p>No tienes direcciones de envío registradas.</p>}
                <ul className="space-y-4">
                    {addresses.map((address) => (
                        <li key={address.id} className="flex justify-between items-center p-4 border rounded shadow">
                            <div>
                                <p className="font-semibold">{address.nombre} {address.apellido}</p>
                                <p>{address.direccion}</p>
                                <p>{address.ciudad}, {address.provincia}</p>
                                <p>{address.telefono}</p>
                                {address.es_principal && <span className="text-green-500 font-bold">Principal</span>}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => startEditing(address)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(address.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={() => {
                    setShowForm(true);
                    setEditingAddress(null);
                    resetForm();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded mt-5"
            >
                Agregar Nueva Dirección
            </button>

            ---

            {/* Sección de Historial de Pedidos */}
            <h2 className="text-2xl font-semibold mt-10 mb-5">Historial de Pedidos</h2>
            {loadingPedidos && <p>Cargando historial de pedidos...</p>}
            {errorPedidos && <p className="text-red-500">{errorPedidos}</p>}
            {pedidos.length === 0 && !loadingPedidos && <p>No tienes pedidos en tu historial.</p>}
            {pedidos.length > 0 && (
                <div className="shadow-lg rounded-lg overflow-hidden">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Número de Pedido</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado de Pago</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado de Envío</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pedidos.map((pedido) => (
                                <tr key={pedido.id} className="hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap">{pedido.numero_pedido}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">${parseFloat(pedido.total).toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{pedido.estado_pago}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{pedido.estado_envio}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <Link href={`/mi-cuenta/pedido/${pedido.id}`} className="text-blue-600 hover:text-blue-800 font-semibold">
                                            Ver Detalles
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ShippingAddressesPage;