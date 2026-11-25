import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/LoginPage.css";
import imgConsultorio from "../assets/images/img_consultorio.png";
import { authApi } from "../services/api";
import { validarEmail } from "../utils/validators";
import LoginLogo from "../components/login/LoginLogo";
import WelcomeMessage from "../components/login/WelcomeMessage";
import InputField from "../components/login/InputField";
import Button from "../components/login/Button";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    async function manejarSubmit(e) {
        e.preventDefault();
        const errMail = validarEmail(email);
        if (errMail) {
            setError(errMail);
            return;
        }
        setError("");
        setCargando(true);
        try {
            const res = await authApi.forgotPassword(email.trim());
            setMensaje(res?.message || "Si el correo está registrado, recibirás un enlace de recuperación.");
        } catch (err) {
            setError(err.message);
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
                        <WelcomeMessage
                            title="¿Has olvidado tu contraseña?"
                            subtitle="Escribe tu correo electrónico y te enviaremos un enlace para restablecerla"
                        />
                    </div>

                    <div className="login-campos">
                        <InputField
                            label="Correo electrónico"
                            type="email"
                            icon="mail"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={error}
                        />
                    </div>

                    {mensaje && (
                        <div style={{ backgroundColor: "#ecfdf3", color: "#027a48", padding: "12px", borderRadius: "8px", fontSize: "14px" }}>
                            {mensaje}
                        </div>
                    )}

                    <Button type="submit" disabled={cargando}>
                        {cargando ? "Enviando..." : "Enviar"}
                    </Button>

                    <p className="register-link">
                        <span>Regresar a</span>
                        <Link to="/login" className="link-btn" style={{ textDecoration: "none" }}>
                            Iniciar sesión
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}