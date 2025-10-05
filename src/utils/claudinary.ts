// uploadImage.ts
export async function subirImagen(file: File, carpeta: string = "Torner Express") {
  const url = "https://api.cloudinary.com/v1_1/dfbpaq83u/image/upload";
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "tonerexpress"); // preset configurado en Cloudinary
  formData.append("folder", carpeta); // 👈 aquí defines la carpeta

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("❌ Error al subir la imagen");
  }

  const data = await res.json();
  return data.secure_url;
}
