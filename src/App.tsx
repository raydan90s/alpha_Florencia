// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import Carrito from './pages/carrito';
import Home from './pages/index';


// CONTEXTOS
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { FilterProvider } from './context/FilterContext';
import { ConfiguracionProvider } from './context/SettingContext';
import { PermissionProvider } from './context/PermissionContext';
import { HistorialProvider } from './context/HistorialContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <FilterProvider>
          <ProductProvider>
            <PermissionProvider>
              <ConfiguracionProvider>
                <HistorialProvider>
                  <CartProvider>
                    <div className="min-h-screen flex flex-col justify-between">
                      <Header />
                      <main className="flex-grow">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/carrito" element={<Carrito />} />


                        </Routes>
                      </main>s
                      <Footer />
                    </div>
                  </CartProvider>
                </HistorialProvider>
              </ConfiguracionProvider>
            </PermissionProvider>
          </ProductProvider>
        </FilterProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
