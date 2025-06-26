"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Product } from "../types/product";
import axios from "axios";

interface ProductContextType {
    products: Product[];
    setProducts: Dispatch<SetStateAction<Product[]>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get<Product[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/productos-con-imagenes`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    return (
        <ProductContext.Provider
            value={{ products, setProducts }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProducts debe ser usado dentro de un ProductProvider");
    }
    return context;
}
