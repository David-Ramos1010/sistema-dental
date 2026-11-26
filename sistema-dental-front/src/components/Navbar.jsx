import { useLocation } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

const TITULOS_RUTA = {
    "/citas": "Gestión de Citas Odontológicas",
    "/pacientes": "Gestión de Pacientes",
    "/dentistas": "Directorio de Odontólogos",
    "/tratamientos": "Catálogo de Tratamientos",
    "/mi-perfil": "Mi Perfil de Paciente",
    "/usuarios": "Administración de Usuarios",
};

const ETIQUETA_ROL = {
    ADMIN: "Administrador/a",
    DENTISTA: "Odontólogo/a",
    PACIENTE: "Paciente",
};

const obtenerTitulo = (pathname) => {
    const rutaEncontrada = Object.keys(TITULOS_RUTA).find((ruta) =>
        pathname.startsWith(ruta)
    );
    return TITULOS_RUTA[rutaEncontrada] || "Clínica Dental";
};

const obtenerIniciales = (nombre) => {
    if (!nombre) return "U";
    const palabras = nombre.trim().split(" ");
    if (palabras.length === 1) return palabras[0].charAt(0).toUpperCase();
    return (palabras[0].charAt(0) + palabras[1].charAt(0)).toUpperCase();
};

export default function Navbar({ onToggleMenu }) {
    const { usuario } = useAuth();
    const location = useLocation();
    const titulo = obtenerTitulo(location.pathname);

    return (
        <header className="navbar-container">
            <div className="navbar-left">
                <button
                    type="button"
                    className="navbar-menu-btn"
                    onClick={onToggleMenu}
                    aria-label="Abrir menú"
                >
                    ☰
                </button>
                <h1 className="navbar-title">{titulo}</h1>
            </div>

            <div className="navbar-user">
                <div className="user-text">
                    <span className="user-name">{usuario?.nombre}</span>
                    <span className="user-role">
                        {ETIQUETA_ROL[usuario?.rol] || usuario?.rol}
                        {usuario?.email ? ` • ${usuario.email}` : ""}
                    </span>
                </div>

                {usuario?.avatar ? (
                    <img
                        src={usuario.avatar}
                        alt={usuario.nombre || "Foto de Perfil"}
                        className="user-avatar"
                    />
                ) : (
                    <div className="user-avatar-placeholder">
                        {obtenerIniciales(usuario?.nombre)}
                    </div>
                )}
            </div>
        </header>
    );
}