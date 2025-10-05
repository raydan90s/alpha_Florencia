// utils/numero.ts
export const numero = "+593 99 396 3541";

export function formatNumeroWhatsApp(num: string): string {
  // Quita todo lo que no sea dígito
  return num.replace(/\D/g, "");
}
