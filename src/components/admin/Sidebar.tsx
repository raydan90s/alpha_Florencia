// components/admin/Sidebar.tsx
import React from "react";

interface SidebarProps {
    selectedSection: string;
    onSelect: (section: string) => void;
    hasPermission: (permiso: string) => boolean;

}

const Sidebar: React.FC<SidebarProps> = ({ selectedSection, onSelect }) => {
    const sections = [
        { id: "productos", label: "Productos", permission: "ver_productos" },
        { id: "marcas", label: "Marcas", permission: "ver_marcas" },
        { id: "modelos", label: "Modelos", permission: "ver_modelos" },
        { id: "inventario", label: "Inventario", permission: "ver_inventario" },
        { id: "historial", label: "Historial de Ventas", permission: "ver_historial_admin" },
        { id: "pagos", label: "Pagos", permission: "ver_pagos" },
        { id: "config", label: "Configuración", permission: "ver_configuracion" },
    ];


    return (
        <div className="w-64 bg-white h-screen p-6 shadow-md">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <ul>
                {sections.map((sec) => (
                    <li
                        key={sec.id}
                        onClick={() => onSelect(sec.id)}
                        className={`cursor-pointer py-2 px-4 rounded hover:bg-gray-200 ${selectedSection === sec.id ? "bg-gray-300 font-bold" : ""
                            }`}
                    >
                        {sec.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
