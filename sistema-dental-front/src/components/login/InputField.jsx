//actualizado para aguantar mensajes de validación debajo de cada campo

import "../../css/InputField.css";

const iconos = {
    mail: <path d="M2 5.5l8 5.5 8-5.5M3.5 4h13A1.5 1.5 0 0118 5.5v9a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 14.5v-9A1.5 1.5 0 013.5 4z" />,
    lock: <path d="M6 9V6.5a4 4 0 118 0V9M5.5 9h9a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 15.5v-5A1.5 1.5 0 015.5 9z" />,
    user: <path d="M16.667 17.5v-1.667a3.333 3.333 0 00-3.334-3.333H6.667a3.333 3.333 0 00-3.334 3.333V17.5M10 9.167a3.333 3.333 0 100-6.667 3.333 3.333 0 000 6.667z" />,
    phone: <path d="M18.333 14.1v2.5a1.667 1.667 0 01-1.816 1.667 16.492 16.492 0 01-7.192-2.559 16.25 16.25 0 01-5-5 16.492 16.492 0 01-2.558-7.225A1.667 1.667 0 013.425 1.667h2.5a1.667 1.667 0 011.667 1.433c.105.8.301 1.586.583 2.342a1.667 1.667 0 01-.375 1.758l-1.058 1.058a13.333 13.333 0 005 5l1.058-1.058a1.667 1.667 0 011.758-.375c.756.282 1.542.478 2.342.583a1.667 1.667 0 011.433 1.692z" />,
};

export default function InputField({ label, type = "text", icon, placeholder, value, onChange, error, autoComplete }) {
    return (
        <label className="input-field">
            <span className="input-label">{label}</span>
            <span className="input-caja" style={error ? { borderColor: "#d92d20" } : undefined}>
                {icon && iconos[icon] && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#667085"
                        strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
                        {iconos[icon]}
                    </svg>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                />
            </span>
            {error && <small style={{ color: "#d92d20", fontSize: "12px" }}>{error}</small>}
        </label>
    );
}