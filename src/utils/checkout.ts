type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
import type { CartItem } from "../types/carContext";

//ESTA ES SOLO DE PRUEBA 
export const crearCheckoutPrueba = async (
  setCheckoutId: SetState<string | null>,
  setShowPaymentWidget: SetState<boolean>,
  setLoadingPayment: SetState<boolean>,
  setErrorPayment: SetState<string | null>
) => {
  try {
    setLoadingPayment(true);
    setErrorPayment(null);

    const body = {
      amount: "10.00",
      currency: "USD",
      paymentType: "DB",
      customer: {
        givenName: "Juan",
        middleName: "Carlos",
        surname: "Pérez",
        ip: "186.46.123.22",
        merchantCustomerId: "cliente123",
        email: "juan@mail.com",
        identificationDocId: "0912345678",
        phone: "0998765432"
      },
      shipping: { street1: "Av. Siempre Viva 742" },
      billing: { street1: "Av. Siempre Viva 742" },
      cart: {
        items: [
          {
            name: "Producto Test",
            description: "Compra de prueba",
            price: "10.00",
            quantity: "1"
          }
        ]
      },
      merchantTransactionId: `trx_test_${Date.now()}`
    };

    const response = await fetch("http://localhost:5000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.id) {
      setCheckoutId(data.id);
      setShowPaymentWidget(true);
    } else {
      throw new Error("No se recibió checkoutId");
    }
  } catch (err: any) {
    setErrorPayment(err.message);
  } finally {
    setLoadingPayment(false);
  }
};

interface CrearCheckoutRealParams {
  direccionEnvio: {
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    cedula: string;
    ciudad?: string;
    provincia?: string;
    middleName?: string;
  };
  userId: string | number | null;
  user: { email?: string } | null;
  total: string;
  producto: CartItem[],
  setCheckoutId: React.Dispatch<React.SetStateAction<string | null>>;
  setShowPaymentWidget: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingPayment: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorPayment: React.Dispatch<React.SetStateAction<string | null>>;
}

//ESTA ES LA VERDADERA LA QUE SE VA A EJECUTAR EN PRODUCCION
export const crearCheckoutReal = async ({
  direccionEnvio,
  userId,
  user,
  total,
  producto,
  setCheckoutId,
  setShowPaymentWidget,
  setLoadingPayment,
  setErrorPayment
}: CrearCheckoutRealParams) => {
  try {
    setLoadingPayment(true);
    setErrorPayment(null);

    // Obtener IP directamente desde el backend
    const ipResponse = await fetch("http://localhost:5000/api/cliente-ip");
    const ipData = await ipResponse.json();
    const ip = ipData?.ip || "0.0.0.0"; // Fallback si no se obtiene IP

    const body = {
      amount: total,
      currency: "USD",
      paymentType: "DB",
      customer: {
        givenName: direccionEnvio.nombre,
        middleName: direccionEnvio.middleName || "",
        surname: direccionEnvio.apellido,
        ip,
        merchantCustomerId: userId?.toString() || "cliente123",
        email: user?.email || "",
        identificationDocId: direccionEnvio.cedula.padStart(10, "0"),
        phone: direccionEnvio.telefono
      },
      shipping: {
        street1: direccionEnvio.direccion,
        city: direccionEnvio.ciudad || "",
        state: direccionEnvio.provincia || ""
      },
      billing: {
        street1: direccionEnvio.direccion,
        city: direccionEnvio.ciudad || "",
        state: direccionEnvio.provincia || ""
      },
      cart: {
        items: producto.map((item) => ({
          name: item.nombre,
          description: `Descripción: ${item.nombre}`,
          price: item.precio.toFixed(2), // obligatorio en string formato decimal
          quantity: item.cantidad
        }))
      },
      merchantTransactionId: `trx_${Date.now()}`
    };

    const response = await fetch("http://localhost:5000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.id) {
      setCheckoutId(data.id);
      setShowPaymentWidget(true);
    } else {
      throw new Error("No se recibió checkoutId");
    }
  } catch (err: any) {
    setErrorPayment(err.message);
  } finally {
    setLoadingPayment(false);
  }
};
