import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthRedirect = (isAuthenticated: boolean) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = sessionStorage.getItem('redirectAfterAuth');

      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterAuth');
        setTimeout(() => {
          navigate(redirectUrl, { replace: true });
        }, 500);
      }
    }
  }, [isAuthenticated, navigate]);
};

export default useAuthRedirect;