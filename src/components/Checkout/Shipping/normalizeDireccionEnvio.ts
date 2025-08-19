import type { DireccionEnvio } from "../../../types/direccionEnvio";

export function normalizeDireccionEnvio(
  data: Partial<DireccionEnvio> & { postal?: string }
): DireccionEnvio {
  return {
    nombre: data.nombre ?? "",
    apellido: data.apellido ?? "",
    direccion: data.direccion ?? "",
    telefono: data.telefono ?? "",
    cedula: data.cedula ?? "",
    ciudad: data.ciudad ?? "",
    provincia: data.provincia ?? "",
    pastcode: data.pastcode ?? data.postal ?? "",
    guardarDatos: data.guardarDatos ?? false,
    notas: data.notas ?? "",
  };
}
