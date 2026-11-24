//Guarda la sesión en localStorage y genera un avatar SVG con las iniciales del usuario para la barra superior

import { createContext, useContext, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

function generarAvatarIniciales(nombre = "Usuario") {
    const iniciales = nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() || "")
        .join("") || "U";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
        <rect width="80" height="80" rx="40" fill="#7C3AED"/>
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="30" font-weight="700">${iniciales}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        try {
            const guardado = localStorage.getItem("usuario");
            return guardado ? JSON.parse(guardado) : null;
        } catch {
            return null;
        }
    });

    const guardarSesion = (data) => {
        const token = data.token || data.accessToken;
        if (token) localStorage.setItem("token", token);

        const perfil = {
            id: data.id,
            nombre: data.nombre || "Usuario",
            email: data.email,
            rol: data.rol,
            avatar: data.avatar || generarAvatarIniciales(data.nombre),
        };
        localStorage.setItem("usuario", JSON.stringify(perfil));
        setUsuario(perfil);
        return perfil;
    };

    const iniciarSesion = async (email, password) => {
        const data = await authApi.login({ email, password });
        return guardarSesion(data);
    };

    const registrarPaciente = async (datos) => {
        const data = await authApi.register(datos);
        if (data?.token || data?.accessToken) {
            return guardarSesion(data);
        }
        return data;
    };

    const cerrarSesion = async () => {
        try {
            await authApi.logout();
        } catch {
            // Si el token ya expiró, igualmente limpiamos la sesión local
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            setUsuario(null);
        }
    };

    return (
        <AuthContext.Provider value={{ usuario, iniciarSesion, registrarPaciente, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
}