import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/LoginPage.css";
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