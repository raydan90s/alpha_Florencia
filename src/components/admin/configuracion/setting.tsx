"use client";

import AdminRegister from "./AdminRegister";
import IVAConfig from "./IVAConfig";
import PrecioEnvioConfig from "./PrecioEnvioConfig";

export default function SettingManager() {
  return (
    <div className="p-6 bg-white rounded shadow-md mt-6 space-y-10">
      <AdminRegister />
      <IVAConfig />
      <PrecioEnvioConfig />
    </div>
  );
}
