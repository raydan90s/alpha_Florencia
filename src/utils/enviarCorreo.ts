import emailjs from "@emailjs/browser";
import type { CartItem } from "../types/carContext";
const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const service = import.meta.env.VITE_SERVICE_EMAIL;
interface OrderCost {
    shipping: number;
    tax: number;
    total: number;
}

export function enviarCorreoVerificacion(nombre: string, email: string, token: string) {
    const link = `https://tonerexpress-ec.com/verificar?token=${token}`;

    emailjs.send(
        service,
        "template_lgrk88a",
        {
            nombre,
            link_verificacion: link,
            to_email: email,
        },
        key
    )
        .catch(err => console.error(err));
}

export async function enviarCorreoConfirmacionCompra(
    email: string,
    orderId: string,
    orders: CartItem[],
    cost: OrderCost
) {
    // Generar tabla completa de productos con estilos inline
    const ordersHtml = `
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <thead>
                <tr>
                    <th style="border-bottom: 2px solid #333; padding: 8px; text-align: left; font-weight: bold; background-color: #f8f9fa;">Producto</th>
                    <th style="border-bottom: 2px solid #333; padding: 8px; text-align: left; font-weight: bold; background-color: #f8f9fa;">Descripción</th>
                    <th style="border-bottom: 2px solid #333; padding: 8px; text-align: right; font-weight: bold; background-color: #f8f9fa;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${orders
            .map(
                (item) => `
                    <tr>
                        <td style="padding: 12px 8px; border-bottom: 1px solid #eee; vertical-align: top; width: 80px;">
                            <img 
                                src="${item.imagen}" 
                                style="height: 60px; width: auto; display: block; border-radius: 4px;" 
                                alt="${item.nombre}" 
                            />
                        </td>
                        <td style="padding: 12px 8px; border-bottom: 1px solid #eee; vertical-align: top;">
                            <div style="font-weight: bold; margin-bottom: 4px; color: #333;">
                                ${item.nombre}
                            </div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 2px;">
                                Cantidad: ${item.cantidad}
                            </div>
                            <div style="color: #666; font-size: 13px;">
                                Precio unitario: $${item.precio}
                            </div>
                        </td>
                        <td style="padding: 12px 8px; border-bottom: 1px solid #eee; vertical-align: top; text-align: right;">
                            <strong style="color: #333; font-size: 15px;">
                                $${(Number(item.precio.toFixed(2)) * Number(item.cantidad.toFixed(2))).toFixed(2)}
                            </strong>
                        </td>
                    </tr>
                `
            )
            .join("")}
            </tbody>
        </table>
    `;

    try {
        const response = await emailjs.send(
            service,
            "template_zwwszdh",
            {
                to_email: email,
                order_id: orderId,
                orders_list: ordersHtml,
                shipping_cost: `$${cost.shipping.toFixed(2)}`,
                tax_cost: `$${cost.tax.toFixed(2)}`,
                total_cost: `$${cost.total.toFixed(2)}`,
            },
            key
        );
        console.log("✅ Correo de compra enviado:", response);
        return response;
    } catch (err) {
        console.error("❌ Error sending purchase confirmation:", err);
        throw err;
    }
}

