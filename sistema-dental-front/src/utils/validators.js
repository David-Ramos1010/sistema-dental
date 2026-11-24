export const TELEFONO_REGEX = /^\+[1-9]\d{7,14}$/;

export function validarEmail(email) {
    if (!email || !email.trim()) return "El correo electrónico es obligatorio";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email.trim())) return "Ingresa un correo electrónico válido";
    return "";
}

export function validarPasswordSegura(password) {
    if (!password) return "La contraseña es obligatoria";
    if (password.length < 8) return "Debe tener al menos 8 caracteres";
    if (!/[A-Z]/.test(password)) return "Debe incluir al menos una letra mayúscula";
    if (!/[a-z]/.test(password)) return "Debe incluir al menos una letra minúscula";
    if (!/\d/.test(password)) return "Debe incluir al menos un número";
    if (!/[^A-Za-z0-9]/.test(password)) return "Debe incluir al menos un carácter especial (@, #, $, etc.)";
    return "";
}