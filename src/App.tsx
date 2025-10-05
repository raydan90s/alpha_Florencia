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
import ProductosPage from './pages/productos';
import Carrito from './pages/carrito';
import Checkout from './pages/checkout';
import Contactanos from './pages/contactanos';
import EnvioEntrega from './pages/envio-entrega';
import IniciarSesion from './pages/iniciar-sesion';
import ShippingAddressesPage from './pages/mi-cuenta';
import PoliticaPrivacidad from './pages/politica-privacidad';
import QuienesSomos from './pages/quienes-somos';
import Registro from './pages/registrarse';
import TerminosCondiciones from './pages/terminos-condiciones';
import AdminDashboard from './pages/admin/dashboard';
import AdminLogin from './pages/admin/login';
import DetalleProductoPage from './pages/DetalleProductoPage';
import ResultadoPago from './pages/resultado-pago';
import VerificarPage from './pages/verificar';
import RestablecerPassword from './pages/RestablecerPassword';

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
                      <Route path="/productos" element={<ProductosPage />} />
                      <Route path="/carrito" element={<Carrito />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/contactanos" element={<Contactanos />} />
                      <Route path="/envio-entrega" element={<EnvioEntrega />} />
                      <Route path="/iniciar-sesion" element={<IniciarSesion />} />
                      <Route path="/mi-cuenta" element={<ShippingAddressesPage />} />
                      <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
                      <Route path="/quienes-somos" element={<QuienesSomos />} />
                      <Route path="/registrarse" element={<Registro />} />
                      <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/productos/:slug" element={<DetalleProductoPage />} />
                      <Route path="/resultado-pago" element={<ResultadoPago />} />
                      <Route path='/verificar' element={<VerificarPage />} />
                      <Route path="/restablecer-password" element={<RestablecerPassword />} />
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
