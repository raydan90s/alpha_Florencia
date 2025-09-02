import type { Product } from "../../types/product";
import axios from 'axios';

export const filtrarProductos = (
  productos: Product[],
  searchQuery: string = ""
): Product[] => {
  const query = searchQuery?.trim().toLowerCase();

  if (!query) return productos;

  return productos.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||  // Usamos el operador opcional
      product.description?.toLowerCase().includes(query) ||
      product.model.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query)
  );
};

export const obtenerModelosPorMarca = async (id_marca: number) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/modelos/${id_marca}`, {
      headers: {
        'X-API-Key': import.meta.env.VITE_API_KEY
      }
    });
    return response.data; // se espera un array de modelos [{ id, nombre, id_marca }]
  } catch (error) {
    console.error("Error al obtener modelos:", error);
    return [];
  }
};

export const filtrarPorMarcaYModelo = (
  productos: Product[],
  marca: string = "",
  modelo: string = ""
): Product[] => {
  return productos.filter(product => {
    const marcaMatch = !marca || (product.brand && typeof product.brand === 'string' && product.brand.toLowerCase().includes(marca.toLowerCase()));
    const modeloMatch = !modelo || (product.model && typeof product.model === 'string' && product.model.toLowerCase().includes(modelo.toLowerCase()));
    return marcaMatch && modeloMatch;
  });
};

export const buscarTodos = (
  productos: Product[],
  searchQuery: string = "",
  marca: string = "",
  modelo: string = ""
): Product[] => {
  const resultadoBusqueda = filtrarProductos(productos, searchQuery);
  return filtrarPorMarcaYModelo(resultadoBusqueda, marca, modelo);
};

export function obtenerMarcasDisponibles(productos: Product[]): string[] {
  return Array.from(
    new Set(
      productos
        .filter(p => p.estado === "Activo") // Solo productos activos
        .map(p => p.brand)
        .filter((brand): brand is string => brand !== undefined)
    )
  );
}

export function obtenerModelosDisponibles(productos: Product[], marca: string): string[] {
  if (!marca) return [];

  return Array.from(
    new Set(
      productos
        .filter(
          p =>
            p.brand?.toLowerCase() === marca.toLowerCase() &&
            p.estado === "Activo"
        )
        .map(p => p.model)
        .filter(Boolean)
    )
  );
}


export const obtenerMarcasDisponibleApi = async (): Promise<{ id: number; nombre: string }[]> => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/marcas`, {
      headers: {
        'X-API-Key': import.meta.env.VITE_API_KEY
      }
    });
    return response.data as { id: number; nombre: string }[]; // Especificamos el tipo correcto
  } catch (error) {
    console.error("Error al obtener marcas desde la API:", error);
    return [];
  }
};

export const obtenerInventariosPorProductoId = async (productId: number) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/producto/${productId}`, {
      headers: {
        'X-API-Key': import.meta.env.VITE_API_KEY,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener inventario desde la API:", error);
    return [];
  }
};
