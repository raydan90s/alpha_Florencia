import { useState, useEffect } from "react";
import type { DireccionEnvio } from "../../types/direccionEnvio";
import { normalizeDireccionEnvio } from "./normalizeDireccionEnvio";

export function useDireccionPrincipal(isAuthenticated: boolean, userId: number | null) {
  const [tieneDireccionPrincipal, setTieneDireccionPrincipal] = useState(false);
  const [direccionPrincipalData, setDireccionPrincipalData] = useState<DireccionEnvio | null>(null);

  useEffect(() => {
    const checkDireccionPrincipal = async () => {
      if (isAuthenticated && userId) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/usuarios/${userId}/direccion-envio/principal`
          );

          if (res.ok) {
            const data = await res.json();

            let hasDireccionPrincipal = false;
            let direccionData = null;

            if (Array.isArray(data)) {
              if (data.length > 0 && data[0] && (data[0].nombre || data[0].direccion || data[0].telefono)) {
                hasDireccionPrincipal = true;
                direccionData = data[0];
              }
            } else if (data && typeof data === "object") {
              if (data.nombre || data.direccion || data.telefono) {
                hasDireccionPrincipal = true;
                direccionData = data;
              }
            }

            setTieneDireccionPrincipal(hasDireccionPrincipal);
            if (hasDireccionPrincipal && direccionData) {
              setDireccionPrincipalData(normalizeDireccionEnvio(direccionData));
            }
          } else {
            setTieneDireccionPrincipal(false);
            setDireccionPrincipalData(null);
          }
        } catch (error) {
          console.error("Error verificando dirección principal:", error);
          setTieneDireccionPrincipal(false);
          setDireccionPrincipalData(null);
        }
      } else {
        setTieneDireccionPrincipal(false);
        setDireccionPrincipalData(null);
      }
    };

    checkDireccionPrincipal();
  }, [isAuthenticated, userId]);

  return { tieneDireccionPrincipal, direccionPrincipalData };
}
