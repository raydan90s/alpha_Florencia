// C:\Users\Sistemas\Documents\Florencia\src\types\product.ts

export type Product = {
    id: number;
    name: string;
    category?: string;
    description: string;
    slug:string;
    price: number;
    model: string;
    brand?: string;
    primera_imagen_url?: string | null; 
    estado?:string,
    stock:number,
    images?: Images[];
    image: string;
    inventarios?: Inventario[];
  };

export type Images = {
  url: string;
  orden?: number;
};

export interface Inventario {
  id:number;
  nombre: string;
  cantidad: number;
  stock:number;
}

