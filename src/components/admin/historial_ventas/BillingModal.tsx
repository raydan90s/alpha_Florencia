import React, { useEffect, useState } from "react";

interface BillingData {
    nombre: string;
    apellido?: string;
    direccion: string;
    identificacion: string;
    correo: string;
    ciudad?: string;
    provincia?: string;
}

interface BillingModalProps {
    pedidoId: number;
    cerrarModal: () => void;
}

const BillingModal: React.FC<BillingModalProps> = ({ pedidoId, cerrarModal }) => {
    const [datos, setDatos] = useState<BillingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDatos = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/facturacion/${pedidoId}`
                );
                const data = await response.json();
                setDatos(data);
            } catch (error) {
                console.error("Error al obtener los datos de facturación:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDatos();
    }, [pedidoId]);


    // Cerrar con ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") cerrarModal();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [cerrarModal]);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && cerrarModal()}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center rounded-t-lg">
                    <h3 className="text-xl font-bold text-gray-800">Datos de Facturación</h3>
                    <button
                        onClick={cerrarModal}
                        className="text-gray-400 hover:text-gray-600 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-4 text-gray-600">Cargando datos...</span>
                        </div>
                    ) : datos ? (
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm font-medium text-gray-600">Nombre:</span>
                                <p className="text-base font-medium text-gray-800">{datos.nombre} {datos.apellido || ""}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Dirección:</span>
                                <p className="text-base font-medium text-gray-800">{datos.direccion}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Identificación:</span>
                                <p className="text-base font-medium text-gray-800">{datos.identificacion}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Correo:</span>
                                <p className="text-base font-medium text-gray-800">{datos.correo}</p>
                            </div>
                            {datos.ciudad && (
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Ciudad:</span>
                                    <p className="text-base font-medium text-gray-800">{datos.ciudad}</p>
                                </div>
                            )}
                            {datos.provincia && (
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Provincia:</span>
                                    <p className="text-base font-medium text-gray-800">{datos.provincia}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No se encontraron datos de facturación para este usuario.</p>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end rounded-b-lg">
                    <button
                        onClick={cerrarModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillingModal;
