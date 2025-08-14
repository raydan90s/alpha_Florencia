import emailjs from "@emailjs/browser";

export function enviarCorreoVerificacion(nombre: string, email: string, token: string) {
    const link = `http://localhost:5173/verificar?token=${token}`;
    const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    emailjs.send(
        "service_sg27e4d",
        "template_d3z94tg",
        {
            nombre,
            link_verificacion: link,
            to_email: email,
        },
        key
    )
        .then(() => console.log("Correo de verificación enviado!"))
        .catch(err => console.error(err));
}
