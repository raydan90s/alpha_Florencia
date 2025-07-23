"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { Dispatch, SetStateAction, ReactNode } from "react";
import type { Product } from "../types/product";
import axios from "axios";

interface ProductContextType {
    products: Product[];
    setProducts: Dispatch<SetStateAction<Product[]>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get<Product[]>(
                    `${import.meta.env.VITE_API_BASE_URL}/api/productos-con-imagenes`
                );
                setProducts(response.data);
            } catch (error) {
                console.error("Error al cargar productos:", error);

            }
        };

        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProducts debe ser usado dentro de un ProductProvider");
    }
    return context;
};

export { ProductProvider, useProducts };
