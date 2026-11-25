//Centraliza todas las peticiones hacia http://localhost:8089/api
//adjunta el token JWT en cada llamada protegida
//traduce los errores del backend (ErrorResponse) para mostrarlos en pantalla
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8089/api';

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

// Alias compatible con AuthContext.jsx y las demás páginas
export const authApi = {
  ...authService,
  register: authService.registro,
  forgotPassword: authService.olvidePassword,
  resetPassword: authService.restablecerPassword,
};