export type DireccionEnvio = {
  id?:number;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  cedula: string;
  ciudad: string;
  provincia: string;
  pastcode: string;  
  guardarDatos: boolean;
  notas: string;
  es_principal?:boolean;
};
