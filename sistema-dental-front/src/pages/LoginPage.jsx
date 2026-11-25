import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/LoginPage.css";
import "../css/SocialButton.css";
import imgConsultorio from "../assets/images/img_consultorio.png";
import { useAuth } from "../context/AuthContext";
import { validarEmail } from "../utils/validators";
import LoginLogo from "../components/login/LoginLogo";
import WelcomeMessage from "../components/login/WelcomeMessage";
import InputField from "../components/login/InputField";
import Button from "../components/login/Button";

export default function LoginPage() {
    const { iniciarSesion } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [cargando, setCargando] = useState(false);

    async function manejarSubmit(e) {
        e.preventDefault();
        const errs = {};
        const errMail = validarEmail(email);
        if (errMail) errs.email = errMail;
        if (!password.trim()) errs.password = "Ingresa tu contraseña";

        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setCargando(true);
        try {
            await iniciarSesion(email.trim(), password);
            navigate("/citas");
        } catch (err) {
            setErrors({ general: err.message });
        } finally {
            setCargando(false);
        }
    }

    function manejarLoginSocial(proveedor) {
        console.log(`Iniciando sesión con ${proveedor}`);
    }

    return (
        <div className="login-page">
            <div className="login-imagen">
                <img src={imgConsultorio} alt="Consultorio dental" />
            </div>

            <div className="login-derecha">
                <form className="login-form" onSubmit={manejarSubmit} noValidate>
                    <div className="login-superior">
                        <LoginLogo />
                        <WelcomeMessage />
                    </div>

                    <div className="login-campos">
                        <InputField
                            label="Correo electrónico"
                            type="email"
                            icon="mail"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            error={errors.email}
                        />
                        <InputField
                            label="Contraseña"
                            type="password"
                            icon="lock"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            error={errors.password}
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-10px" }}>
                        <Link to="/olvide-password" className="link-btn" style={{ fontSize: "14px", textDecoration: "none" }}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {errors.general && <p className="login-error">{errors.general}</p>}

                    <Button type="submit" disabled={cargando}>
                        {cargando ? "Entrando..." : "Iniciar sesión"}
                    </Button>

                    <div className="divider">
                        <span className="divider-linea"></span>
                        <p>O continúa con</p>
                        <span className="divider-linea"></span>
                    </div>

                    <div className="login-sociales">
                        <button
                            type="button"
                            className="social-btn"
                            onClick={() => manejarLoginSocial("Google")}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.6 2.8C6.1 7.2 8.8 5 12 5z" />
                                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z" />
                                <path fill="#FBBC05" d="M5.2 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.6-2.8z" />
                                <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.9-2.2-6.8-5.1l-3.6 2.8C3.5 20.8 7.4 24 12 24z" />
                            </svg>
                            Google
                        </button>

                        <button
                            type="button"
                            className="social-btn"
                            onClick={() => manejarLoginSocial("Facebook")}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                    </div>

                    <p className="register-link">
                        <span>¿Aún no tienes cuenta?</span>
                        <Link to="/registro" className="link-btn" style={{ textDecoration: "none" }}>
                            Regístrate
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}