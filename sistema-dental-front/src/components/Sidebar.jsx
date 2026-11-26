import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import imgLogo from "../assets/images/img_logo.png";
import { useAuth } from "../context/AuthContext";

const MENU_ITEMS = [
    { to: "/citas", label: "Citas", roles: ["ADMIN", "DENTISTA", "PACIENTE"] },
    { to: "/pacientes", label: "Pacientes", roles: ["ADMIN", "DENTISTA"] },
    { to: "/dentistas", label: "Odontólogos", roles: ["ADMIN", "DENTISTA", "PACIENTE"] },
    { to: "/tratamientos", label: "Tratamientos", roles: ["ADMIN", "DENTISTA", "PACIENTE"] },
    { to: "/mi-perfil", label: "Mi Perfil", roles: ["PACIENTE"] },
    { to: "/usuarios", label: "Usuarios", roles: ["ADMIN"] },
];

export default function Sidebar({ isOpen, onClose }) {
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const enlacesVisibles = MENU_ITEMS.filter((item) => item.roles.includes(usuario?.rol));

    const handleLogout = async () => {
        if (onClose) onClose();
        await cerrarSesion();
        navigate("/login");
    };

    return (
        <>
            {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

            <aside className={`sidebar-container ${isOpen ? "open" : ""}`}>
                <div className="sidebar-brand">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={imgLogo} alt="Logo Clínica Dental" className="brand-logo-img" />
                        <span className="brand-title">Clinica Dental</span>
                    </div>
                    <button
                        type="button"
                        className="sidebar-close-btn"
                        onClick={onClose}
                        aria-label="Cerrar menú"
                    >
                        ✕
                    </button>
                </div>

                <nav className="sidebar-menu">
                    {enlacesVisibles.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={({ isActive }) => `sidebar-btn ${isActive ? "active" : ""}`}
                            style={{ textDecoration: "none" }}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <button type="button" className="sidebar-logout" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
}