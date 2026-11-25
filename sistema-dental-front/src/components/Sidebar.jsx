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

export default function Sidebar() {
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const enlacesVisibles = MENU_ITEMS.filter((item) => item.roles.includes(usuario?.rol));

    const handleLogout = async () => {
        await cerrarSesion();
        navigate("/login");
    };

    return (
        <aside className="sidebar-container">
            <div className="sidebar-brand">
                <span className="brand-title">Clinica Dental</span>
                <img src={imgLogo} alt="Logo Clínica Dental" className="brand-logo-img" />
            </div>

            <nav className="sidebar-menu">
                {enlacesVisibles.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
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
    );
}