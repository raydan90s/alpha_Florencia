import React, { useState } from "react";
import type { DireccionEnvio } from "../../types/direccionEnvio";
import ShippingField from "./Shipping/ShippingField";
import ShippingCheckbox from "./Shipping/ShippingCheckbox";
import { useDireccionPrincipal } from "./Shipping/useDireccionPrincipal";
import { normalizeDireccionEnvio } from "./Shipping/normalizeDireccionEnvio";
import { validateField } from "./Shipping/validateField";

interface ShippingProps {
  onChange: (direccion: DireccionEnvio) => void;
  isAuthenticated: boolean;
  userId: number | null;
  value: DireccionEnvio;
}

const Shipping: React.FC<ShippingProps> = ({ onChange, isAuthenticated, userId, value }) => {
  const { tieneDireccionPrincipal, direccionPrincipalData } = useDireccionPrincipal(isAuthenticated, userId);

  const [usarDireccionPrincipal, setUsarDireccionPrincipal] = useState(false);
  const [formAutoCargado, setFormAutoCargado] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue, type, checked } = e.target;
    if (name !== "guardarDatos" && formAutoCargado) setFormAutoCargado(false);

    onChange({ ...value, [name]: type === "checkbox" ? checked : inputValue });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;
    const errorMessage = validateField(name, inputValue);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleUsarDireccionPrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setUsarDireccionPrincipal(checked);

    if (checked && direccionPrincipalData) {
      onChange({ ...direccionPrincipalData, guardarDatos: false });
      setFormAutoCargado(true);
      setErrors({});
    } else {
      onChange(normalizeDireccionEnvio({ guardarDatos: false }));
      setFormAutoCargado(false);
      setErrors({});
    }
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
      <h4 className="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-200 pb-2">
        Datos de envío
      </h4>

      {isAuthenticated && tieneDireccionPrincipal && (
        <ShippingCheckbox
          id="usarDireccionPrincipal"
          name="usarDireccionPrincipal"
          label="Usar dirección guardada principal"
          checked={usarDireccionPrincipal}
          onChange={handleUsarDireccionPrincipalChange}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <ShippingField label="Nombres" name="nombre" value={value.nombre} required
          placeholder="Juan" error={errors.nombre} disabled={usarDireccionPrincipal}
          onChange={handleChange} onBlur={handleBlur} />

        <ShippingField label="Apellidos" name="apellido" value={value.apellido} required
          placeholder="Pérez" error={errors.apellido} disabled={usarDireccionPrincipal}
          onChange={handleChange} onBlur={handleBlur} />
      </div>

      <ShippingField label="Dirección" name="direccion" value={value.direccion} required
        placeholder="Av. Siempre Viva 123" error={errors.direccion} disabled={usarDireccionPrincipal}
        onChange={handleChange} onBlur={handleBlur} />

      <ShippingField label="Número de Teléfono" name="telefono" type="tel" value={value.telefono} required
        placeholder="0999999999" error={errors.telefono} disabled={usarDireccionPrincipal}
        onChange={handleChange} onBlur={handleBlur} />

      <ShippingField label="Número de Cédula/RUC" name="cedula" value={value.cedula} required
        placeholder="0975123684" error={errors.cedula} disabled={usarDireccionPrincipal}
        onChange={handleChange} onBlur={handleBlur} />

      <ShippingField label="Ciudad" name="ciudad" value={value.ciudad} required
        placeholder="Guayaquil" error={errors.ciudad} disabled={usarDireccionPrincipal}
        onChange={handleChange} onBlur={handleBlur} />

      <ShippingField label="Provincia" name="provincia" value={value.provincia} required
        placeholder="Guayas" error={errors.provincia} disabled={usarDireccionPrincipal}
        onChange={handleChange} onBlur={handleBlur} />

      <ShippingField label="Código Postal" name="pastcode" type="number" value={value.pastcode} required
        placeholder="090101" error={errors.pastcode} disabled={usarDireccionPrincipal}
        onChange={handleChange} onBlur={handleBlur} />

      {isAuthenticated && !formAutoCargado && !usarDireccionPrincipal && (
        <ShippingCheckbox
          name="guardarDatos"
          label="Guardar datos para próximos envíos"
          checked={value.guardarDatos}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default Shipping;
