// hooks/useAuthRedirect.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = (isAuthenticated: boolean) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Verificar si hay una URL de redirección guardada
      const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
      
      if (redirectUrl) {
        console.log('🔄 Redirigiendo después del registro exitoso a:', redirectUrl);
        
        // Limpiar la URL de redirección
        sessionStorage.removeItem('redirectAfterAuth');
        
        // Redirigir con un pequeño delay para asegurar que el contexto esté actualizado
        setTimeout(() => {
          navigate(redirectUrl, { replace: true });
        }, 100);
      }
    }
  }, [isAuthenticated, navigate]);
};

export const handlePostAuthRedirect = (navigate: ReturnType<typeof useNavigate>) => {
  const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
  
  if (redirectUrl) {
    console.log('🔄 Redirigiendo después del registro exitoso a:', redirectUrl);
    sessionStorage.removeItem('redirectAfterAuth');
    
    setTimeout(() => {
      navigate(redirectUrl, { replace: true });
    }, 100);
    
    return true; // Indica que se realizó una redirección
  }
  
  return false; // No había redirección pendiente
};

export const cleanExpiredCheckoutData = () => {
  try {
    const savedData = sessionStorage.getItem('checkoutFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const dataAge = Date.now() - (parsedData.timestamp || 0);
      const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos
      
      if (dataAge > oneHour) {
        sessionStorage.removeItem('checkoutFormData');
        console.log('🧹 Datos de checkout expirados eliminados');
      }
    }
  } catch (error) {
    console.error('Error al limpiar datos de checkout:', error);
    sessionStorage.removeItem('checkoutFormData');
  }
};

// Para usar en tu App.tsx o componente principal
export const useCheckoutDataCleanup = () => {
  useEffect(() => {
    // Limpiar datos expirados al cargar la aplicación
    cleanExpiredCheckoutData();
    
    // Limpiar datos expirados cada 30 minutos
    const interval = setInterval(cleanExpiredCheckoutData, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
};