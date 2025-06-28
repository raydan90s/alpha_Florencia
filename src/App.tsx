// src/App.tsx
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

import { AuthProvider } from './context/AuthContext';
import { FilterProvider } from './context/FilterContext';
import { ProductProvider } from './context/ProductContext';
import { PermissionProvider } from './context/PermissionContext';
import { ConfiguracionProvider } from './context/SettingContext';
import { HistorialProvider } from './context/HistorialContext';
import { CartProvider } from './context/CartContext';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

// Para la fuente Inter: importarla por CSS o usar @fontsource/inter

export default function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <ProductProvider>
          <PermissionProvider>
            <ConfiguracionProvider>
              <HistorialProvider>
                <CartProvider>
                  <div className="font-inter">
                    <Header />
                    <Routes>
                      <Route path="/" element={<Home />} />
                    </Routes>
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
