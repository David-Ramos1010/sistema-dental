import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../css/LoginPage.css";
import imgConsultorio from "../assets/images/img_consultorio.png";
import { authApi } from "../services/api";
import { validarPasswordSegura } from "../utils/validators";
import LoginLogo from "../components/login/LoginLogo";
import WelcomeMessage from "../components/login/WelcomeMessage";
import InputField from "../components/login/InputField";
import Button from "../components/login/Button";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const tokenUrl = searchParams.get("token") || "";
    const navigate = useNavigate();

    const [token, setToken] = useState(tokenUrl);
    const [password, setPassword] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [errors, setErrors] = useState({});
    const [exito, setExito] = useState("");
    const [cargando, setCargando] = useState(false);

    async function manejarSubmit(e) {
        e.preventDefault();
        const errs = {};
        if (!token.trim()) errs.token = "Falta el token de recuperación";
        const errPass = validarPasswordSegura(password);
        if (errPass) errs.password = errPass;
        if (password !== confirmar) errs.confirmar = "Las contraseñas no coinciden";

        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setCargando(true);
        try {
            await authApi.resetPassword({ token: token.trim(), newPassword: password });
            setExito("Contraseña actualizada correctamente. Redirigiendo...");
            setTimeout(() => navigate("/login"), 2000);
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
                        <WelcomeMessage
                            title="Restablecer contraseña"
                            subtitle="Ingresa tu nueva contraseña segura para acceder"
                        />
                    </div>

                    <div className="login-campos">
                        {!tokenUrl && (
                            <InputField
                                label="Token de recuperación"
                                icon="lock"
                                placeholder="Pega el token recibido"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                error={errors.token}
                            />
                        )}
                        <InputField
                            label="Contraseña"
                            type="password"
                            icon="lock"
                            placeholder="Mín. 8 caracteres, mayúscula, número y símbolo"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                        />
                        <InputField
                            label="Confirmar contraseña"
                            type="password"
                            icon="lock"
                            placeholder="Repite la contraseña"
                            value={confirmar}
                            onChange={(e) => setConfirmar(e.target.value)}
                            error={errors.confirmar}
                        />
                    </div>

                    {errors.general && <p className="login-error">{errors.general}</p>}

                    {exito && (
                        <div style={{ backgroundColor: "#ecfdf3", color: "#027a48", padding: "12px", borderRadius: "8px", fontSize: "14px" }}>
                            {exito}
                        </div>
                    )}

                    <Button type="submit" disabled={cargando}>
                        {cargando ? "Guardando..." : "Guardar"}
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