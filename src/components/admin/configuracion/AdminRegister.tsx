"use client";

import { useEffect, useState } from "react";

const permisosDisponibles = [
    { id: "ver_productos", label: "Ver productos" },
    { id: "ver_marcas", label: "Ver marcas" },
    { id: "ver_modelos", label: "Ver modelos" },
    { id: "ver_inventario", label: "Ver inventario" },
    { id: "ver_configuracion", label: "Ver configuración" },
    { id: "ver_historial_ventas", label: "Ver historial de ventas" },
    { id: "ver_pago", label: "Ver pagos" },
];

const rolesDisponibles = ["Admin", "Cliente"];

export default function AdminRegister() {
    // Registro
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [permisosSeleccionadosRegistro, setPermisosSeleccionadosRegistro] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [permisosUsuarioOriginal, setPermisosUsuarioOriginal] = useState<string[]>([]); // <-- guardamos permisos originales

    // Búsqueda
    const [emailBusqueda, setEmailBusqueda] = useState("");
    const [usuarioEncontrado, setUsuarioEncontrado] = useState<any>(null);
    const [rolSeleccionado, setRolSeleccionado] = useState("");

    useEffect(() => {
        if (rolSeleccionado === "Cliente") {
            setPermisosSeleccionadosRegistro([]); // Limpiar permisos si el rol es Cliente
        } else if (rolSeleccionado === "Admin") {
            setPermisosSeleccionadosRegistro(permisosUsuarioOriginal); // Restaurar permisos si el rol es Admin
        }
    }, [rolSeleccionado, permisosUsuarioOriginal]);

    useEffect(() => {
        // Cuando cambia el rol seleccionado, actualizamos backend
        if (!usuarioEncontrado) return;

        const actualizarRolBackend = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuario/rol`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_usuario: usuarioEncontrado.id, nuevoRol: rolSeleccionado }),
                });

                if (!res.ok) throw new Error("Error actualizando rol");

                if (rolSeleccionado === "Cliente") {
                    // Si es cliente, limpiamos permisos localmente y en backend
                    setPermisosSeleccionadosRegistro([]);
                    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuario/permisos`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id_usuario: usuarioEncontrado.id,
                            permisos: [],
                        }),
                    });
                } else if (rolSeleccionado === "Admin") {
                    setPermisosSeleccionadosRegistro(permisosUsuarioOriginal); // Restauramos permisos originales si es admin
                }
            } catch (error: any) {
                alert("Error actualizando rol: " + error.message);
            }
        };

        actualizarRolBackend();
    }, [rolSeleccionado, usuarioEncontrado, permisosUsuarioOriginal]);

    const handleRegisterAdmin = async () => {
        if (!nombre || !email || !password || !confirmarPassword) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        if (password !== confirmarPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/registrar/admin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    tipo: "Admin",
                    nombre,
                    email,
                    password,
                    permisos: permisosSeleccionadosRegistro,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Error al registrar el usuario");

            setSuccessMessage("Administrador registrado exitosamente.");
            setErrorMessage("");
            setNombre("");
            setEmail("");
            setPassword("");
            setConfirmarPassword("");
            setPermisosSeleccionadosRegistro([]);
            setTimeout(() => setSuccessMessage(""), 4000);
        } catch (err: any) {
            setErrorMessage(err.message || "Error inesperado.");
        }
    };

    const handleBuscarUsuario = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuario?email=${emailBusqueda}`, {
                headers: {
                    'X-API-Key': import.meta.env.VITE_API_KEY,
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Usuario no encontrado");
            setUsuarioEncontrado(data.usuario);
            setRolSeleccionado(data.usuario.rol);
            setPermisosSeleccionadosRegistro(data.usuario.permisos);
            setPermisosUsuarioOriginal(data.usuario.permisos);

        } catch (err: any) {
            setUsuarioEncontrado(null);
            alert(err.message);
        }
    };

    const handleActualizarRol = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuario/rol`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_usuario: usuarioEncontrado.id, nuevoRol: rolSeleccionado }),
            });
            alert("Rol actualizado correctamente");
        } catch {
            alert("Error al actualizar el rol");
        }
    };

    const handleActualizarPermisos = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuario/permisos`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_usuario: usuarioEncontrado.id,
                    permisos: permisosSeleccionadosRegistro
                }),
            });
            alert("Permisos actualizados correctamente");
        } catch {
            alert("Error al actualizar permisos");
        }
    };

    return (
        <div>
            {/* Registro */}
            <h4 className="font-semibold mb-4">Registrar Nuevo Administrador</h4>
            {successMessage && <div className="mb-4 p-2 bg-green-100 text-green-800">{successMessage}</div>}
            {errorMessage && <div className="mb-4 p-2 bg-red-100 text-red-800">{errorMessage}</div>}

            <input placeholder="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} className="border px-4 py-2 rounded w-full mb-2" />
            <input placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} className="border px-4 py-2 rounded w-full mb-2" />
            <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} className="border px-4 py-2 rounded w-full mb-2" />
            <input placeholder="Confirmar contraseña" type="password" value={confirmarPassword} onChange={e => setConfirmarPassword(e.target.value)} className="border px-4 py-2 rounded w-full mb-2" />

            <h5 className="font-semibold mt-4 mb-2">Permisos del Administrador</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {permisosDisponibles.map((permiso) => (
                    <label key={permiso.id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={permisosSeleccionadosRegistro.includes(permiso.id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setPermisosSeleccionadosRegistro([...permisosSeleccionadosRegistro, permiso.id]);
                                } else {
                                    setPermisosSeleccionadosRegistro(permisosSeleccionadosRegistro.filter((p) => p !== permiso.id));
                                }
                            }}
                        />
                        <span>{permiso.label}</span>
                    </label>
                ))}
            </div>

            <button onClick={handleRegisterAdmin} className="px-4 py-2 rounded w-full bg-[#003366] hover:bg-blue-600 text-white mb-6">
                Registrar Administrador
            </button>

            {/* Búsqueda y edición */}
            <h4 className="font-semibold mt-8 mb-2">Buscar y Modificar Usuario</h4>
            <input
                type="email"
                placeholder="Correo del usuario"
                value={emailBusqueda}
                onChange={(e) => setEmailBusqueda(e.target.value)}
                className="border px-4 py-2 rounded w-full mb-2"
            />
            <button onClick={handleBuscarUsuario} className="px-4 py-2 rounded w-full bg-[#003366] hover:bg-blue-600 text-white mb-6">
                Buscar Usuario
            </button>

            {usuarioEncontrado && (
                <div className="border p-4 rounded bg-gray-100">
                    <p><strong>Nombre:</strong> {usuarioEncontrado.nombre}</p>
                    <p><strong>Correo:</strong> {usuarioEncontrado.email}</p>
                    <p><strong>Rol actual:</strong></p>
                    <select
                        value={rolSeleccionado}
                        onChange={(e) => setRolSeleccionado(e.target.value)}
                        className="border px-2 py-1 rounded mt-1 mb-3"
                    >
                        {rolesDisponibles.map((rol) => (
                            <option key={rol} value={rol}>{rol}</option>
                        ))}
                    </select>
                    <button onClick={handleActualizarRol} className="px-4 py-2 rounded w-full bg-[#003366] hover:bg-blue-600 text-white mb-6">Actualizar Rol</button>

                    <h5 className="font-semibold mt-2">Permisos</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        {permisosDisponibles.map((permiso) => (
                            <label key={permiso.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={permisosSeleccionadosRegistro.includes(permiso.id)}
                                    disabled={rolSeleccionado === "Cliente"} // <-- aquí
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setPermisosSeleccionadosRegistro([...permisosSeleccionadosRegistro, permiso.id]);
                                        } else {
                                            setPermisosSeleccionadosRegistro(permisosSeleccionadosRegistro.filter((p) => p !== permiso.id));
                                        }
                                    }}
                                />
                                <span>{permiso.label}</span>
                            </label>
                        ))}
                    </div>
                    <button
                        onClick={handleActualizarPermisos}
                        className="px-4 py-2 rounded w-full bg-[#003366] hover:bg-blue-600 text-white mb-6 disabled:bg-gray-400"
                    >
                        Actualizar Permisos
                    </button>
                </div>
            )}
        </div>
    );
}
