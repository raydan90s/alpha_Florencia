// Helper function for validation of shipping form fields
export const validateField = (name: string, value: string): string => {
  switch (name) {
    case "nombre":
      if (value.trim().length < 3) {
        return "Ingrese un nombre válido.";
      }
      return "";

    case "apellido":
      if (value.trim().length < 3) {
        return "Ingrese un apellido válido.";
      }
      return "";

    case "direccion":
      if (value.trim().length < 5) {
        return "Ingrese dirección válida.";
      }
      return "";

    case "telefono": {
      const telefonoRegex = /^\d{10}$/;
      if (!telefonoRegex.test(value)) {
        return "Ingrese un teléfono válido (10 dígitos).";
      }
      return "";
    }

    case "cedula": {
      const cedulaRegex = /^\d{10}$/;
      if (!cedulaRegex.test(value)) {
        return "Ingrese un documento válido (10 dígitos).";
      }
      return "";
    }

    case "pastcode": {
      const pastcodeRegex = /^\d{1,6}$/;
      if (!pastcodeRegex.test(value) || value.length > 6) {
        return "Ingrese un código válido (1 a 6 dígitos).";
      }
      return "";
    }

    case "ciudad":
    case "provincia":
      if (value.trim().length < 3) {
        return "Ingrese una dirección válida.";
      }
      return "";

    default:
      return "";
  }
};
