import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { enviarCorreoVerificacion } from "../utils/enviarCorreo";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import type { RegisterFormData } from "../types/RegisterTypes";
import AlreadyRegisteredScreen from "../components/registrarse/AlreadyRegisteredScreen";
import VerificationSuccessScreen from "../components/registrarse/VerificationSuccessScreen";
import SuccessNotification from "../components/registrarse/SuccessNotification";
import RegisterForm from "../components/registrarse/RegisterForm";

export default function Registro() {
  const { register, authError, setAuthError, user, isAuthenticated } = useContext(AuthContext);
  useAuthRedirect(isAuthenticated);

  const [mounted, setMounted] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const isFromCheckout = sessionStorage.getItem('redirectAfterAuth') === '/checkout';

  useEffect(() => {
    setMounted(true);
    setAuthError(null);
  }, [setAuthError]);

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    direccion: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!mounted) {
    return <p>Cargando...</p>;
  }

  if (user) {
    return <AlreadyRegisteredScreen />;
  }

  if (registrationComplete) {
    return (
      <VerificationSuccessScreen
        userEmail={userEmail}
        isFromCheckout={isFromCheckout}
        onRegisterAnother={() => {
          setRegistrationComplete(false);
          setFormData({
            name: "",
            apellido: "",
            email: "",
            password: "",
            confirmPassword: "",
            telefono: "",
            direccion: "",
          });
        }}
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);

      if (!result.error) {
        if (result.verificationToken) {
          await enviarCorreoVerificacion(
            formData.name,
            formData.email,
            result.verificationToken
          );
        }

        setUserEmail(formData.email);
        setRegistrationComplete(true);
        setSuccess(true);
        setError("");

        // Limpiar el formulario
        setFormData({
          name: "",
          apellido: "",
          email: "",
          password: "",
          confirmPassword: "",
          telefono: "",
          direccion: "",
        });
      } else {
        setError(result.message || "Error al registrarse");
        setSuccess(false);
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
      setSuccess(false);
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  return (
    <>
      <SuccessNotification show={success && !registrationComplete} />
      <RegisterForm
        formData={formData}
        onSubmit={handleSubmit}
        onChange={handleChange}
        loading={loading}
        error={error}
        authError={authError}
        isFromCheckout={isFromCheckout}
      />
    </>
  );
}