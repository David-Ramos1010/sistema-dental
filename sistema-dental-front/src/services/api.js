//Centraliza todas las peticiones hacia http://localhost:8089/api
//adjunta el token JWT en cada llamada protegida
//traduce los errores del backend (ErrorResponse) para mostrarlos en pantalla
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8089/api';

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté encendido en el puerto 8089.');
  }

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { mensaje: text };
  }

  if (!response.ok) {
    const fieldErrors = data?.errores || null;
    const validationMsg = fieldErrors ? Object.values(fieldErrors)[0] : null;
    const errorMsg =
      validationMsg ||
      data?.mensaje ||
      data?.message ||
      data?.error ||
      `Error HTTP ${response.status}`;

    const error = new Error(errorMsg);
    if (fieldErrors) error.fieldErrors = fieldErrors;
    throw error;
  }

  return data;
}

export const authService = {
  login: (credenciales, password) => {
    const payload =
      typeof credenciales === 'object' ? credenciales : { email: credenciales, password };
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  registro: ({ nombre, email, password, telefono }) =>
    request('/auth/registro', {
      method: 'POST',
      body: JSON.stringify({
        nombre,
        email,
        password,
        telefono: telefono && telefono.trim() !== '' ? telefono.trim() : null,
      }),
    }),

  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),

  olvidePassword: (email) => {
    const payload = typeof email === 'object' ? email : { email };
    return request('/auth/olvide-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  restablecerPassword: (tokenOrPayload, nuevaPassword) => {
    const payload =
      typeof tokenOrPayload === 'object'
        ? tokenOrPayload
        : { token: tokenOrPayload, nuevaPassword };
    return request('/auth/restablecer-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  me: () => request('/auth/me'),
};

export const authApi = {
  ...authService,
  register: authService.registro,
  forgotPassword: authService.olvidePassword,
  resetPassword: authService.restablecerPassword,
};

// --- CITAS ---
export const citasService = {
  listar: ({ page = 0, size = 10, estado, desde, hasta, dentistaId, pacienteId, q } = {}) =>
    request(`/citas${buildQuery({ page, size, estado, desde, hasta, dentistaId, pacienteId, q })}`),

  obtener: (id) => request(`/citas/${id}`),

  crear: (payload) =>
    request('/citas', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  actualizar: (id, payload) =>
    request(`/citas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  cambiarEstado: (id, estado) =>
    request(`/citas/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    }),

  eliminar: (id) =>
    request(`/citas/${id}`, {
      method: 'DELETE',
    }),
};

// --- TRATAMIENTOS ---
export const tratamientosService = {
  listar: ({ page = 0, size = 10, q, activo } = {}) =>
    request(`/tratamientos${buildQuery({ page, size, q, activo })}`),

  obtener: (id) => request(`/tratamientos/${id}`),

  crear: (payload) =>
    request('/tratamientos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  actualizar: (id, payload) =>
    request(`/tratamientos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  eliminar: (id) =>
    request(`/tratamientos/${id}`, {
      method: 'DELETE',
    }),
};

// --- CATÁLOGO (DENTISTAS Y ESPECIALIDADES) ---
export const catalogoService = {
  listarDentistas: ({ page = 0, size = 10, q, especialidadId } = {}) =>
    request(`/dentistas${buildQuery({ page, size, q, especialidadId })}`),

  listarEspecialidades: () => request('/especialidades'),
};

// --- PACIENTES ---
export const pacientesService = {
  listar: ({ page = 0, size = 10, q } = {}) =>
    request(`/pacientes${buildQuery({ page, size, q })}`),

  miPerfil: () => request('/pacientes/mi-perfil'),

  actualizarMiPerfil: (payload) =>
    request('/pacientes/mi-perfil', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  obtener: (id) => request(`/pacientes/${id}`),

  actualizar: (id, payload) =>
    request(`/pacientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

// --- ADMINISTRACIÓN DE USUARIOS ---
export const usuariosAdminService = {
  listar: ({ page = 0, size = 10, q, rol, activo } = {}) =>
    request(`/admin/usuarios${buildQuery({ page, size, q, rol, activo })}`),

  obtener: (id) => request(`/admin/usuarios/${id}`),

  crear: (payload) =>
    request('/admin/usuarios', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  actualizar: (id, payload) =>
    request(`/admin/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  cambiarActivo: (id, activo) =>
    request(`/admin/usuarios/${id}/activo`, {
      method: 'PATCH',
      body: JSON.stringify({ activo }),
    }),
};