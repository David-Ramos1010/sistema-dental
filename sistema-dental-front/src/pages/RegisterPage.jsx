import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/LoginPage.css";
import imgConsultorio from "../assets/images/img_consultorio.png";
import { useAuth } from "../context/AuthContext";
import { validarEmail, validarPasswordSegura, TELEFONO_REGEX } from "../utils/validators";
import LoginLogo from "../components/login/LoginLogo";
import WelcomeMessage from "../components/login/WelcomeMessage";
import InputField from "../components/login/InputField";
import Button from "../components/login/Button";

export default function RegisterPage() {
    const { registrarPaciente } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ nombre: "", email: "", telefono: "", password: "", confirmar: "" });
    const [errors, setErrors] = useState({});
    const [cargando, setCargando] = useState(false);

    async function manejarSubmit(e) {
        e.preventDefault();
        const errs = {};
        if (!form.nombre.trim()) errs.nombre = "El nombre completo es obligatorio";
        const errMail = validarEmail(form.email);
        if (errMail) errs.email = errMail;
        if (form.telefono.trim() && !TELEFONO_REGEX.test(form.telefono.trim())) {
            errs.telefono = "Usa formato internacional, ej. +5219511234567";
        }
        const errPass = validarPasswordSegura(form.password);
        if (errPass) errs.password = errPass;
        if (form.password !== form.confirmar) errs.confirmar = "Las contraseñas no coinciden";

        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setCargando(true);
        try {
            const res = await registrarPaciente({
                nombre: form.nombre.trim(),
                email: form.email.trim(),
                telefono: form.telefono.trim() || null,
                password: form.password,
            });
            navigate(res?.rol ? "/citas" : "/login");
        } catch (err) {
            setErrors({ general: err.message, ...(err.fieldErrors || {}) });
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
                <form className="login-form" onSubmit={manejarSubmit} noValidate style={{ gap: "16px" }}>
                    <div className="login-superior" style={{ gap: "14px" }}>
                        <LoginLogo />
                        <WelcomeMessage
                            title="Registro"
                            subtitle="Crea tu cuenta de paciente para agendar tus citas"
                        />
                    </div>

                    <div className="login-campos" style={{ gap: "14px" }}>
                        <InputField
                            label="Nombre completo *"
                            icon="user"
                            placeholder="Ej. Ana López"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            error={errors.nombre}
                        />
                        <InputField
                            label="Correo electrónico *"
                            type="email"
                            icon="mail"
                            placeholder="ana@correo.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            error={errors.email}
                        />
                        <InputField
                            label="Teléfono (opcional)"
                            icon="phone"
                            placeholder="+5219511234567"
                            value={form.telefono}
                            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                            error={errors.telefono}
                        />
                        <InputField
                            label="Contraseña *"
                            type="password"
                            icon="lock"
                            placeholder="Mín. 8 caracteres, mayúscula, número y símbolo"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            error={errors.password}
                        />
                        <InputField
                            label="Confirmar contraseña *"
                            type="password"
                            icon="lock"
                            placeholder="Repite tu contraseña"
                            value={form.confirmar}
                            onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
                            error={errors.confirmar}
                        />
                    </div>

                    {errors.general && <p className="login-error">{errors.general}</p>}

                    <Button type="submit" disabled={cargando}>
                        {cargando ? "Registrando..." : "Regístrate"}
                    </Button>

                    <p className="register-link">
                        <span>¿Ya tienes una cuenta?</span>
                        <Link to="/login" className="link-btn" style={{ textDecoration: "none" }}>
                            Iniciar sesión
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}