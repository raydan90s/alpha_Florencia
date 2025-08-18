import type { DireccionEnvio } from '../../../types/direccionEnvio';

interface AddressListProps {
  addresses: DireccionEnvio[];
  onEdit: (address: DireccionEnvio) => void;
  onDelete: (id?: number) => void;
  loading: boolean;
  error: string | null;
}

const AddressList = ({ addresses, onEdit, onDelete, loading, error }: AddressListProps) => {
  if (loading) {
    return <p className="text-center py-4">Cargando...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-4">{error}</p>;
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-4">No tienes direcciones de envío registradas.</p>
        <p className="text-sm text-gray-500">Agrega tu primera dirección para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div key={address.id} className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">
                  {address.nombre} {address.apellido}
                </h3>
                {Boolean(address.es_principal) && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Principal
                  </span>
                )}
              </div>
              <div className="text-gray-700 space-y-1">
                <p className="flex items-center">
                  <span className="text-gray-500 text-sm mr-2">📍</span>
                  {address.direccion}
                </p>
                <p className="flex items-center">
                  <span className="text-gray-500 text-sm mr-2">🌆</span>
                  {address.ciudad}, {address.provincia}
                </p>
                {address.pastcode && (
                  <p className="flex items-center">
                    <span className="text-gray-500 text-sm mr-2">📮</span>
                    {address.pastcode}
                  </p>
                )}
                <p className="flex items-center">
                  <span className="text-gray-500 text-sm mr-2">📞</span>
                  {address.telefono}
                </p>
                {address.cedula && (
                  <p className="flex items-center">
                    <span className="text-gray-500 text-sm mr-2">🆔</span>
                    {address.cedula}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => onEdit(address)}
                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(address.id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;