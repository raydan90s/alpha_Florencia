import  { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type SortCriteria =
  | "estado"
  | "precioAsc"
  | "precioDesc"
  | "stockAsc"
  | "stockDesc"
  | "marcaAsc"
  | "marcaDesc"
  | "modeloAsc"
  | "modeloDesc"
  | "categoriaAsc"
  | "categoriaDesc"
  | "";

interface FilterContextType {
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterEstado: string;
  setFilterEstado: (value: string) => void;
  filterModelo: string;
  setFilterModelo: (value: string) => void;
  filterMarca: string;
  setFilterMarca: (value: string) => void;
  filterPriceMin: string;
  setFilterPriceMin: (value: string) => void;
  filterPriceMax: string;
  setFilterPriceMax: (value: string) => void;
  filterStockMin: string;
  setFilterStockMin: (value: string) => void;
  filterStockMax: string;
  setFilterStockMax: (value: string) => void;

  sortCriteria: SortCriteria;
  setSortCriteria: (value: SortCriteria) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterCategory, setFilterCategory] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterModelo, setFilterModelo] = useState("");
  const [filterMarca, setFilterMarca] = useState("");
  const [filterPriceMin, setFilterPriceMin] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");
  const [filterStockMin, setFilterStockMin] = useState("");
  const [filterStockMax, setFilterStockMax] = useState("");

  const [sortCriteria, setSortCriteria] = useState<SortCriteria>("");

  return (
    <FilterContext.Provider
      value={{
        filterCategory,
        setFilterCategory,
        filterEstado,
        setFilterEstado,
        filterModelo,
        setFilterModelo,
        filterMarca,
        setFilterMarca,
        filterPriceMin,
        setFilterPriceMin,
        filterPriceMax,
        setFilterPriceMax,
        filterStockMin,
        setFilterStockMin,
        filterStockMax,
        setFilterStockMax,
        sortCriteria,
        setSortCriteria,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter debe usarse dentro de un FilterProvider");
  }
  return context;
};
