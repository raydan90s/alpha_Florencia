import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { FilterProvider } from "@/context/FilterContext";
import { ConfiguracionProvider } from "@/context/SettingContext";
import { PermissionProvider } from "@/context/PermissionContext";
import { HistorialProvider } from "@/context/HistorialContext";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <FilterProvider>
        <ProductProvider>
          <PermissionProvider>
            <ConfiguracionProvider>
              <HistorialProvider>
                <CartProvider>
                  <div className={inter.className}>
                    <Header />
                    <Component {...pageProps} />
                    <Footer />
                  </div>
                </CartProvider>
              </HistorialProvider>
            </ConfiguracionProvider>
          </PermissionProvider>
        </ProductProvider>
      </FilterProvider>
    </AuthProvider>
  );
}
