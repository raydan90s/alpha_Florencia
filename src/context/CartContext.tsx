"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem, ProductoAgregar } from "../types/carContext";
import { useConfiguracion } from "./SettingContext";
import { AuthContext } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  agregarAlCarrito: (producto: ProductoAgregar) => Promise<void>;
  actualizarCantidad: (id: number, nuevaCantidad: number) => Promise<void>;
  eliminarItem: (id: number) => Promise<void>;
  calcularSubtotal: () => number;
  calcularIVA: () => number;
  contarItems: () => number;
  calcularTotal: () => number;
  vaciarCarrito: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { configuracion } = useConfiguracion();
  const { isAuthenticated, user } = useContext(AuthContext);

  const [cargadoDesdeLocalStorage, setCargadoDesdeLocalStorage] = useState(false);
  const agregarAlCarritoDB = useCallback(
    async ({ id_usuario, id_producto, cantidad }: { id_usuario: number; id_producto: number; cantidad: number }) => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, id_producto, cantidad }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);
    },
    []
  );

  const obtenerCarritoDB = useCallback(async (id_usuario: number): Promise<CartItem[]> => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart?id_usuario=${id_usuario}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.cartItems;
  }, []);
  useEffect(() => {
    // Solo cargar desde localStorage si NO está autenticado
    if (!isAuthenticated && !cargadoDesdeLocalStorage) {
      const storedCart = localStorage.getItem("carrito");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      setCargadoDesdeLocalStorage(true);
    }
  }, [isAuthenticated, cargadoDesdeLocalStorage]);

  // ✅ Sincronizar carrito local al iniciar sesión
  useEffect(() => {
    const sincronizarCarrito = async () => {
      if (!isAuthenticated) return;
      if (!user || typeof user.id !== "number") {
        console.warn("Usuario no disponible aún o ID inválido");
        return;
      }

      const storedCart = localStorage.getItem("carrito");
      let migradoConExito = true;

      if (storedCart) {
        const productos: CartItem[] = JSON.parse(storedCart);

        for (const producto of productos) {
          try {
            await agregarAlCarritoDB({
              id_usuario: user.id,
              id_producto: producto.id,
              cantidad: producto.cantidad,
            });
          } catch (error) {
            console.error("❌ Error migrando item:", error);
            migradoConExito = false;
          }
        }

        if (migradoConExito) {
          localStorage.removeItem("carrito");
        }
      }

      try {
        const items = await obtenerCarritoDB(user.id);
        setCartItems(items);
      } catch (error) {
        console.error("❌ Error obteniendo carrito desde DB:", error);
      }
    };

    sincronizarCarrito();
  }, [isAuthenticated, user, agregarAlCarritoDB, obtenerCarritoDB]);


  useEffect(() => {
    if (!isAuthenticated && cargadoDesdeLocalStorage) {
      localStorage.setItem("carrito", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated, cargadoDesdeLocalStorage]);




  const actualizarCantidadDB = useCallback(async ({
    id_usuario,
    id_producto,
    nueva_cantidad,
  }: {
    id_usuario: number;
    id_producto: number;
    nueva_cantidad: number;
  }) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/update/${id_producto}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario, id_producto, nueva_cantidad }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
  }, []);

  const eliminarItemDB = useCallback(async ({
    id_usuario,
    id_producto,
  }: {
    id_usuario: number;
    id_producto: number;
  }) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/remove/${id_producto}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario, id_producto })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
  }, []);

  const agregarAlCarrito = async (producto: ProductoAgregar) => {
    const existeEnCarrito = cartItems.find((item) => item.id === producto.id);
    let newCartItems: CartItem[];

    if (existeEnCarrito) {
      newCartItems = cartItems.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + (producto.cantidad ?? 1) }
          : item
      );
    } else {
      newCartItems = [
        ...cartItems,
        {
          id: producto.id,
          nombre: producto.name,
          precio: producto.precio,
          cantidad: producto.cantidad ?? 1,
          imagen: producto.images[0]?.url || '',
        },
      ];
    }

    setCartItems(newCartItems);
    console.log("Nuevo carrito:", newCartItems); // Verificar el carrito actualizado

    if (!isAuthenticated) {
      localStorage.setItem("carrito", JSON.stringify(newCartItems));
    }

    if (isAuthenticated && user?.id) {
      try {
        await agregarAlCarritoDB({
          id_usuario: user.id,
          id_producto: producto.id,
          cantidad: producto.cantidad ?? 1,
        });
      } catch (error) {
        console.error("Error al sincronizar agregar al carrito con backend:", error);
      }
    }
  };

  const actualizarCantidad = async (id: number, nuevaCantidad: number) => {
    let newCartItems: CartItem[];

    if (nuevaCantidad <= 0) {
      newCartItems = cartItems.filter((item) => item.id !== id);
    } else {
      newCartItems = cartItems.map((item) =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      );
    }

    setCartItems(newCartItems);
    if (!isAuthenticated) {
      localStorage.setItem("carrito", JSON.stringify(newCartItems));
    }

    if (isAuthenticated && user?.id) {
      try {
        await actualizarCantidadDB({
          id_usuario: user.id,
          id_producto: id,
          nueva_cantidad: nuevaCantidad,
        });
      } catch (error) {
        console.error("Error al sincronizar actualizar cantidad con backend:", error);
      }
    }
  };

  const eliminarItem = async (id: number) => {
    const newCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(newCartItems);
    if (!isAuthenticated) {
      localStorage.setItem("carrito", JSON.stringify(newCartItems));
    }

    if (isAuthenticated && user?.id) {
      try {
        await eliminarItemDB({
          id_usuario: user.id,
          id_producto: id,
        });
      } catch (error) {
        console.error("Error al sincronizar eliminar del carrito con backend:", error);
      }
    }
  };

  const vaciarCarrito = async () => {
    if (isAuthenticated && user?.id) {
      // Si está autenticado, vaciar el carrito del backend
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/carrito/vaciar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_usuario: user.id }), // Enviar el id_usuario
        });

        if (res.ok) {
          console.log('✅ Carrito vaciado con éxito desde el backend');
        } else {
          console.error('❌ Error al vaciar el carrito desde el backend');
        }
      } catch (error) {
        console.error('❌ Error al vaciar el carrito:', error);
      }
    } else {
      // Si no está autenticado, eliminar del localStorage
      console.log("🚨 Usuario no autenticado. Eliminando del localStorage.");
      localStorage.removeItem("carrito");
      console.log("✅ Carrito eliminado del localStorage");
    }
  };

  const calcularSubtotal = () => {
    return parseFloat(cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2));
  };

  const calcularIVA = () => {
    const subtotal = calcularSubtotal();
    const ivaRate = configuracion?.iva ?? 0;
    return parseFloat((subtotal * (ivaRate / 100)).toFixed(2));  // Redondeamos el IVA
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const iva = calcularIVA();
    return parseFloat((subtotal + iva).toFixed(2));  // Redondeamos el total
  };
  const contarItems = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  };


  return (
    <CartContext.Provider
      value={{
        cartItems,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarItem,
        calcularSubtotal,
        calcularIVA,
        calcularTotal,
        contarItems,
        vaciarCarrito
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
