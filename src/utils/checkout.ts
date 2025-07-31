type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
import type { CartItem } from "../types/carContext";

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
    pastcode: string;
  };
  userId: string | number | null;
  user: { email?: string } | null;
  total: string;
  subtotal: string;
  iva: string;

  producto: CartItem[],
  setCheckoutId: React.Dispatch<React.SetStateAction<string | null>>;
  setShowPaymentWidget: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingPayment: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorPayment: React.Dispatch<React.SetStateAction<string | null>>;
}

export const crearCheckoutReal = async ({
  direccionEnvio,
  userId,
  user,
  total,
  subtotal,
  iva,
  producto,
  setCheckoutId,
  setShowPaymentWidget,
  setLoadingPayment,
  setErrorPayment
}: CrearCheckoutRealParams) => {
  try {
    setLoadingPayment(true);
    setErrorPayment(null);

    console.log("🚀 Iniciando crearCheckoutReal");
    console.log("Datos de envío:", direccionEnvio);
    console.log("Usuario:", user);
    console.log("Totales:", { total, subtotal, iva });
    console.log("Productos:", producto);

    // Obtener IP desde backend
    const ipResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cliente-ip`);
    const ipData = await ipResponse.json();
    const ip = ipData?.ip || "0.0.0.0";

    console.log("IP obtenida del backend:", ip);

    const body = {
      amount: total,
      currency: "USD",
      paymentType: "DB",
      customer: {
        givenName: direccionEnvio.nombre,
        middleName: direccionEnvio.middleName || "",
        surname: direccionEnvio.apellido,
        ip,
        merchantCustomerId: userId?.toString() || "123",
        email: user?.email || "",
        identificationDocId: direccionEnvio.cedula.padStart(10, "0"),
        identificationDocType: "IDCARD",
        phone: direccionEnvio.telefono
      },
      billing: {
        street1: direccionEnvio.direccion,
        country: "EC",
        city: direccionEnvio.ciudad || "",
        state: direccionEnvio.provincia || "",
        postcode: direccionEnvio.pastcode || "090101" // ✅ genérico válido para Ecuador
      },
      shipping: {
        street1: direccionEnvio.direccion,
        country: "EC",
        city: direccionEnvio.ciudad || "",
        state: direccionEnvio.provincia || ""
      },
      cart: {
        items: producto.map((item) => ({
          name: item.nombre,
          description: `Descripción: ${item.nombre}`,
          price: item.precio.toFixed(2),
          quantity: item.cantidad.toString()
        }))
      },
      merchantTransactionId: `trx_${Date.now()}`,
      customParameters: {
        SHOPPER_VAL_BASE0: "0.00",
        SHOPPER_VAL_BASEIMP: subtotal,
        SHOPPER_VAL_IVA: iva
      }
    };

    console.log("Cuerpo de la petición a /api/checkout:", JSON.stringify(body, null, 2));

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error HTTP ${response.status} en /api/checkout:`, errorText);
      throw new Error(`Error en backend: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("🧾 Respuesta JSON del backend:", data);

    if (data.id) {
      setCheckoutId(data.id);
      setShowPaymentWidget(true);
    } else {
      throw new Error("No se recibió checkoutId en la respuesta del backend");
    }
  } catch (err: any) {
    console.error("Error en crearCheckoutReal:", err);
    setErrorPayment(err.message || "Error desconocido");
  } finally {
    setLoadingPayment(false);
  }
};


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
      amount: "25", // Total: base + IVA
      currency: "USD",
      paymentType: "DB",
      customer: {
        givenName: "Juan",
        middleName: "MARIO",
        surname: "Pérez",
        ip: "186.46.123.22", // Usa IP pública real del cliente si puedes
        merchantCustomerId: "cliente123",
        email: "juan@mail.com",
        identificationDocId: "0912345678",
        identificationDocType: "IDCARD", // 👈 Agrega esto
        phone: "0998765432"
      },
      billing: {
        street1: "Av. Siempre Viva 742",
        country: "EC", // Ecuador
        postcode: "090101" // Código postal válido
      },
      shipping: {
        street1: "Av. Siempre Viva 742",
        country: "EC"
      },
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
      merchantTransactionId: `trx_test_${Date.now()}`,
      customParameters: {
        SHOPPER_VAL_BASE0: "0.00",    // ✅
        SHOPPER_VAL_BASEIMP: "21.74",  // ✅
        SHOPPER_VAL_IVA: "3.26"       // ✅
      }
    };

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/checkout`, {
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