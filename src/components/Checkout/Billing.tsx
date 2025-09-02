import React, {
  useState,
  useContext,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from "react";
import { AuthContext } from "../../context/AuthContext";
import type { DireccionEnvio } from "../../types/direccionEnvio";
import { validateField } from "./Shipping/validateField";

export type BillingHandle = {
  enviarFacturacion: () => Promise<number | null>;
  prepararFacturacion: () => void;
};

type BillingProps = {
  value: DireccionEnvio;
  onChange: (updatedBilling: DireccionEnvio) => void;
  datosEnvio?: DireccionEnvio;
};

const Billing = forwardRef<BillingHandle, BillingProps>(
  ({ onChange, datosEnvio }, ref) => {
    const { user } = useContext(AuthContext);

    const emptyFormData: DireccionEnvio = {
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
      cedula: "",
      ciudad: "",
      provincia: "",
      pastcode: "",
      guardarDatos: false,
      notas: "",
    };

    const [initialCheckboxState] = useState(() => {
      try {
        const stored = sessionStorage.getItem("direccionFacturacion");
        if (stored) return false;
      } catch (error) {
        console.error("❌ Error leyendo datos facturación:", error);
      }
      return true;
    });

    const initialFormData: DireccionEnvio = (() => {
      try {
        const stored = sessionStorage.getItem("direccionFacturacion");
        if (stored) return JSON.parse(stored);
      } catch (error) {
        console.error("❌ Error leyendo datos facturación:", error);
      }
      return emptyFormData;
    })();

    const [igualQueEnvio, setIgualQueEnvio] = useState(initialCheckboxState);
    const [formData, setFormData] = useState<DireccionEnvio>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFormDataChange = useCallback(
      (newData: DireccionEnvio) => {
        onChange(newData);
      },
      [onChange]
    );

    useEffect(() => {
      if (igualQueEnvio && datosEnvio) {
        const datosFacturacion = { ...datosEnvio };
        setFormData(datosFacturacion);
        handleFormDataChange(datosFacturacion);
        sessionStorage.setItem(
          "direccionFacturacion",
          JSON.stringify(datosFacturacion)
        );
      }
    }, [igualQueEnvio, datosEnvio]);

    const handleCheckboxChange = () => {
      const newIgualQueEnvio = !igualQueEnvio;
      setIgualQueEnvio(newIgualQueEnvio);

      if (newIgualQueEnvio && datosEnvio) {
        const datosFacturacion = { ...datosEnvio };
        setFormData(datosFacturacion);
        handleFormDataChange(datosFacturacion);
        sessionStorage.setItem(
          "direccionFacturacion",
          JSON.stringify(datosFacturacion)
        );
      } else {
        setFormData(emptyFormData);
        handleFormDataChange(emptyFormData);
        sessionStorage.removeItem("direccionFacturacion");
        setErrors({});
      }
    };

    const capitalize = (text: string): string =>
      text ? text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      let newValue = value;

      switch (name) {
        case "nombre":
        case "apellido":
        case "ciudad":
        case "provincia":
          newValue = capitalize(value);
          break;
        case "telefono":
          newValue = value.replace(/\D/g, "").slice(0, 10);
          break;
        case "cedula":
          newValue = value.replace(/\D/g, "").slice(0, 13);
          break;
      }

      const updated = { ...formData, [name]: newValue };
      setFormData(updated);

      if (!igualQueEnvio) {
        const isValid =
          updated.nombre.trim() &&
          updated.apellido.trim() &&
          updated.direccion.trim() &&
          updated.telefono.length === 10 &&
          updated.cedula.length >= 10 &&
          updated.cedula.length <= 13 &&
          updated.ciudad.trim() &&
          updated.provincia.trim();

        if (isValid) {
          handleFormDataChange(updated);
          sessionStorage.setItem(
            "direccionFacturacion",
            JSON.stringify(updated)
          );
        } else {
          handleFormDataChange(emptyFormData);
          sessionStorage.removeItem("direccionFacturacion");
        }
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const errorMessage = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    };

    const prepararFacturacion = (): void => {
      try {
        const dataFacturacion = igualQueEnvio && datosEnvio ? { ...datosEnvio } : { ...formData };
        sessionStorage.setItem(
          "direccionFacturacion",
          JSON.stringify(dataFacturacion)
        );
      } catch (error) {
        console.error("❌ Error en prepararFacturacion:", error);
      }
    };

    const enviarFacturacion = async (): Promise<number | null> => {
      try {
        const storedData = sessionStorage.getItem("direccionFacturacion");
        if (!storedData) return null;

        const dataFacturacion: DireccionEnvio = JSON.parse(storedData);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/facturacion`,
          {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              'X-API-Key': import.meta.env.VITE_API_KEY
            },
            body: JSON.stringify({
              id_usuario: user?.id,
              nombre: dataFacturacion.nombre,
              apellido: dataFacturacion.apellido,
              direccion: dataFacturacion.direccion,
              identificacion: dataFacturacion.cedula,
              correo: user?.email,
              ciudad: dataFacturacion.ciudad,
              provincia: dataFacturacion.provincia,
            }),
          }
        );

        const data = await res.json();
        if (data.success) {
          sessionStorage.removeItem("direccionFacturacion");
          return data.facturacionId;
        }
        return null;
      } catch (error) {
        console.error("❌ Error en enviarFacturacion:", error);
        return null;
      }
    };

    useImperativeHandle(ref, () => ({
      enviarFacturacion,
      prepararFacturacion,
    }));

    return (
      <div className="bg-white shadow rounded p-6">
        <h3 className="font-medium text-black text-xl mb-6">
          Información de Facturación
        </h3>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={igualQueEnvio}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">
              Usar la misma dirección que el envío
            </span>
          </label>
        </div>

        {igualQueEnvio && datosEnvio && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Datos de facturación (tomados del envío):</strong>
            </p>
            <div className="text-sm text-gray-700">
              <p>
                <strong>Nombre:</strong> {datosEnvio.nombre} {datosEnvio.apellido}
              </p>
              <p>
                <strong>Dirección:</strong> {datosEnvio.direccion}
              </p>
              <p>
                <strong>Ciudad:</strong> {datosEnvio.ciudad}, {datosEnvio.provincia}
              </p>
              <p>
                <strong>Teléfono:</strong> {datosEnvio.telefono}
              </p>
              <p>
                <strong>Cédula/RUC:</strong> {datosEnvio.cedula}
              </p>
            </div>
          </div>
        )}

        {!igualQueEnvio && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ingresa tu nombre"
              />
              {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
            </div>

            {/* Apellido */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Apellido *</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ingresa tu apellido"
              />
              {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
            </div>

            {/* Dirección */}
            <div className="sm:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">Dirección *</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Calle, número, sector, referencias"
              />
              {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="0999123456"
              />
              {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
            </div>

            {/* Cédula */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Cédula/RUC *</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="1234567890"
              />
              {errors.cedula && <p className="text-red-500 text-sm mt-1">{errors.cedula}</p>}
            </div>

            {/* Ciudad */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Ciudad *</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ej. Guayaquil"
              />
              {errors.ciudad && <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>}
            </div>

            {/* Provincia */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Provincia *</label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ej. Guayas"
              />
              {errors.provincia && <p className="text-red-500 text-sm mt-1">{errors.provincia}</p>}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Nota:</strong> Esta información será utilizada únicamente para la facturación de tu pedido.
          </p>
        </div>
      </div>
    );
  }
);

Billing.displayName = "Billing";
export default Billing;
