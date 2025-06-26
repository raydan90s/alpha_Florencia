
export type CartItem = {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen: string;
};

export type ProductoAgregar = {
  images: any;
  id: number;
  name: string;
  cantidad: number;
  precio: number;
};

export type PedidoPayload = {
    id_usuario: number;
    direccion_envio: string;
    metodo_pago: string;
    items: {
        id_producto: number;
        cantidad: number;
    }[];
};

