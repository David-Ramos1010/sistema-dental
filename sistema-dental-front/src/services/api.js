//Centraliza todas las peticiones hacia http://localhost:8089/api
//adjunta el token JWT en cada llamada protegida
//traduce los errores del backend (ErrorResponse) para mostrarlos en pantalla
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8089/api";

function construirQuery(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && value !== "TODOS") {
            query.append(key, value);
        }
    });
    const str = query.toString();
    return str ? `?${str}` : "";
}

async function request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    let response;
    try {
        response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch {
        throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté encendido en el puerto 8089.");
    }

    if (response.status === 204) return null;

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (response.status === 401 && !endpoint.startsWith("/auth/login")) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
        }
        const error = new Error(data.message || `Error HTTP ${response.status}`);
        error.status = response.status;
        error.fieldErrors = data.errors || null;
        throw error;
    }

    return data;
}

export const authApi = {
    login: (credenciales) => request("/auth/login", { method: "POST", body: JSON.stringify(credenciales) }),
    register: (datos) => request("/auth/register", { method: "POST", body: JSON.stringify(datos) }),
    logout: () => request("/auth/logout", { method: "POST" }),
    forgotPassword: (email) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
    resetPassword: (datos) => request("/auth/reset-password", { method: "POST", body: JSON.stringify(datos) }),
};

export const citasApi = {
    listar: (params) => request(`/citas${construirQuery(params)}`),
    crear: (payload) => request("/citas", { method: "POST", body: JSON.stringify(payload) }),
    actualizar: (id, payload) => request(`/citas/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    cambiarEstado: (id, estado) => request(`/citas/${id}/estado`, { method: "PATCH", body: JSON.stringify({ estado }) }),
    eliminar: (id) => request(`/citas/${id}`, { method: "DELETE" }),
};

export const tratamientosApi = {
    listar: (params) => request(`/tratamientos${construirQuery(params)}`),
    crear: (payload) => request("/tratamientos", { method: "POST", body: JSON.stringify(payload) }),
    actualizar: (id, payload) => request(`/tratamientos/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    eliminar: (id) => request(`/tratamientos/${id}`, { method: "DELETE" }),
};

export const catalogoApi = {
    dentistas: (params) => request(`/dentistas${construirQuery(params)}`),
    especialidades: () => request("/especialidades"),
};

export const pacientesApi = {
    listar: (params) => request(`/pacientes${construirQuery(params)}`),
    actualizar: (id, payload) => request(`/pacientes/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    miPerfil: () => request("/pacientes/mi-perfil"),
    actualizarMiPerfil: (payload) => request("/pacientes/mi-perfil", { method: "PUT", body: JSON.stringify(payload) }),
};

export const usuariosAdminApi = {
    listar: (params) => request(`/usuarios${construirQuery(params)}`),
    crear: (payload) => request("/usuarios", { method: "POST", body: JSON.stringify(payload) }),
    actualizar: (id, payload) => request(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    cambiarActivo: (id, activo) => request(`/usuarios/${id}/activo`, { method: "PATCH", body: JSON.stringify({ activo }) }),
};