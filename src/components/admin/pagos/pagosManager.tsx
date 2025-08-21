"use client";

import { useState } from "react";
import axios from "axios";

interface PaymentResponse {
    id_pago?: number | string;
    paymentType?: string;
    result?: {
        code?: string;
        description?: string;
    };
    resultDetails?: {
        ExtendedDescription?: string;
        AuthCode?: string;
    };
    [key: string]: any;
}

interface AnularResponse {
    paymentType?: string;
    result?: {
        code?: string;
        description?: string;
    };
    resultDetails?: {
        AuthCode?: string;
    };
    [key: string]: any;
}

export default function PagoManager() {
    const [paymentId, setPaymentId] = useState("");
    const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [anulacionLoading, setAnulacionLoading] = useState(false);
    const [anulacionMensaje, setAnulacionMensaje] = useState("");
    const [anulacionResultado, setAnulacionResultado] = useState<AnularResponse | null>(null);

    const handleConsultarPago = async () => {
        const id = paymentId.trim();
        if (!id) {
            alert("Debe ingresar un Payment ID.");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setPaymentData(null);
        setAnulacionMensaje("");
        setAnulacionResultado(null);

        try {
            const res = await axios.get<PaymentResponse>(
                `${import.meta.env.VITE_API_BASE_URL}/api/checkout/consultar`,
                { params: { paymentId: id }, withCredentials: true }
            );
            setPaymentData(res.data);
        } catch (err: any) {
            console.error("Error al consultar pago:", err);
            setErrorMessage(err.response?.data?.error || "No se pudo consultar el pago.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnularPago = async () => {
        // Intentar obtener el ID del pago de diferentes formas
        const idPago = paymentData?.id_pago ||
            (paymentData as any)?.paymentId ||
            paymentId.trim();
        if (!idPago) {
            alert("No hay un pago válido para anular.");
            return;
        }

        if (!confirm(`¿Está seguro de que desea anular el pago con ID ${idPago}?`)) {
            return;
        }

        setAnulacionLoading(true);
        setAnulacionMensaje("");
        setErrorMessage("");
        setAnulacionResultado(null);

        try {
            const res = await axios.post<AnularResponse>(
                `${import.meta.env.VITE_API_BASE_URL}/api/checkout/anular`,
                { id_pago: idPago },
                { withCredentials: true }
            );
            setAnulacionResultado(res.data);

            if (res.data?.result?.code && res.data.result.code.startsWith("000")) {
                setAnulacionMensaje("Pago anulado correctamente.");
            } else {
                setErrorMessage("No se pudo anular el pago: " + (res.data?.result?.description || "Error desconocido"));
            }
        } catch (error: any) {
            console.error("Error al anular pago:", error);
            setErrorMessage(error.response?.data?.error || "Error al anular el pago.");
        } finally {
            setAnulacionLoading(false);
        }
    };

    const mostrarTipoPago = () => {
        if (!paymentData?.paymentType) return "—";
        if (paymentData.paymentType === "RF") return "Pago Anulado";
        if (paymentData.paymentType === "DB") return "Pago Débito";
        return paymentData.paymentType;
    };

    const mostrarBotonAnular = () => paymentData?.paymentType !== "RF";

    return (
        <div className="p-6 bg-white rounded shadow-md">
            <h4 className="font-semibold mb-4">Consultar Pago</h4>

            <input
                type="text"
                placeholder="Ingrese Payment ID"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                className="border px-4 py-2 rounded w-full mb-3"
            />

            <button
                onClick={handleConsultarPago}
                disabled={!paymentId.trim() || loading}
                className={`px-4 py-2 rounded w-full ${!paymentId.trim() || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#003366] hover:bg-blue-600 text-white"
                    }`}
            >
                {loading ? "Consultando..." : "Consultar Pago"}
            </button>

            {errorMessage && (
                <div className="mt-4 p-2 bg-red-100 text-red-800 border border-red-300 rounded">
                    {errorMessage}
                </div>
            )}

            {paymentData && (
                <div className="mt-6 space-y-3">
                    <h5 className="font-medium mb-2">Resultado de la consulta:</h5>

                    <div className="p-3 bg-gray-100 rounded">
                        <p><strong>Tipo de pago:</strong> {mostrarTipoPago()}</p>
                        <p><strong>Código de la consulta:</strong> {paymentData.result?.code || "—"}</p>
                        <p><strong>Descripción de la consulta:</strong> {paymentData.result?.description || "—"}</p>
                        <p><strong>Detalle de la transacción:</strong> {paymentData.resultDetails?.ExtendedDescription || "—"}</p>
                        {paymentData.id_pago && <p><strong>ID Pago:</strong> {paymentData.id_pago}</p>}

                        {/* Mostrar información de debug temporalmente */}
                        <details className="mt-2">
                            <summary className="cursor-pointer text-sm text-gray-600">Ver datos completos (debug)</summary>
                            <pre className="mt-2 p-2 bg-gray-200 text-xs overflow-auto">
                                {JSON.stringify(paymentData, null, 2)}
                            </pre>
                        </details>
                    </div>

                    {mostrarBotonAnular() && (
                        <button
                            onClick={handleAnularPago}
                            disabled={anulacionLoading}
                            className={`mt-4 px-4 py-2 rounded w-full ${anulacionLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 text-white"
                                }`}
                        >
                            {anulacionLoading ? "Anulando..." : "Anular Pago"}
                        </button>
                    )}

                    {anulacionMensaje && (
                        <div className="mt-3 p-2 bg-green-100 text-green-800 border border-green-300 rounded">
                            {anulacionMensaje}
                        </div>
                    )}

                    {anulacionResultado && (
                        <div className="mt-4 p-3 bg-gray-100 rounded space-y-1">
                            <h5 className="font-semibold mb-2">Resultado de la Anulación:</h5>
                            <p><strong>Tipo de transacción:</strong> {anulacionResultado.paymentType || "—"}</p>
                            <p><strong>Código de Anulación:</strong> {anulacionResultado.result?.code || "—"}</p>
                            <p><strong>Descripción de Anulación:</strong> {anulacionResultado.result?.description || "—"}</p>
                            <p><strong>Código de Autorización:</strong> {anulacionResultado.resultDetails?.AuthCode || "—"}</p>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mt-3 p-2 bg-red-100 text-red-800 border border-red-300 rounded">
                            {errorMessage}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}