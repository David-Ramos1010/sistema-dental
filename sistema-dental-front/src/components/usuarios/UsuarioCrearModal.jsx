import { useEffect, useState } from "react";
import Modal from "../Modal";
import { catalogoService, usuariosAdminService } from "../../services/api";

const REGEX_TELEFONO = /^\+[1-9]\d{7,14}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const FORM_INICIAL = {
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    rol: "PACIENTE",
    especialidadId: "",
    cedula: "",
};

export default function UsuarioCrearModal({ isOpen, onClose, onSuccess }) {
    const [form, setForm] = useState(FORM_INICIAL);
    const [errores, setErrores] = useState({});
    const [guardando, setGuardando] = useState(false);
    const [especialidades, setEspecialidades] = useState([]);

    useEffect(() => {
        if (!isOpen) return;
        setForm(FORM_INICIAL);
        setErrores({});
        catalogoService
            .listarEspecialidades()
            .then((lista) => setEspecialidades(lista || []))
            .catch(() => {});
    }, [isOpen]);

    function validarCampo(campo, valor) {
        if (campo === "nombre" && !valor.trim()) return "El nombre es obligatorio";
        if (campo === "email") {
            if (!valor.trim()) return "El correo es obligatorio";
            if (!REGEX_EMAIL.test(valor.trim())) return "Correo electrónico no válido";
        }
        if (campo === "password") {
            if (!valor) return "La contraseña es obligatoria";
            if (!REGEX_PASSWORD.test(valor)) {
                return "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial";
            }
        }
        if (campo === "telefono" && valor.trim() !== "" && !REGEX_TELEFONO.test(valor.trim())) {
            return "Usa formato internacional, ej. +5219511234567";
        }
        if (campo === "cedula" && valor.length > 20) return "Máximo 20 caracteres";
        return "";
    }

    function handleChange(campo, valor) {
        setForm((prev) => ({ ...prev, [campo]: valor }));
        const err = validarCampo(campo, valor);
        setErrores((prev) => ({ ...prev, [campo]: err }));
    }

    async function manejarSubmit(e) {
        e.preventDefault();
        const errs = {
            nombre: validarCampo("nombre", form.nombre),
            email: validarCampo("email", form.email),
            password: validarCampo("password", form.password),
            telefono: validarCampo("telefono", form.telefono),
            cedula: validarCampo("cedula", form.cedula),
        };
        Object.keys(errs).forEach((k) => !errs[k] && delete errs[k]);
        setErrores(errs);
        if (Object.keys(errs).length > 0) return;

        const payload = {
            nombre: form.nombre.trim(),
            email: form.email.trim(),
            password: form.password,
            telefono: form.telefono.trim() !== "" ? form.telefono.trim() : null,
            rol: form.rol,
            especialidadId:
                form.rol === "DENTISTA" && form.especialidadId
                    ? Number(form.especialidadId)
                    : null,
            cedula:
                form.rol === "DENTISTA" && form.cedula.trim() !== ""
                    ? form.cedula.trim()
                    : null,
        };

        setGuardando(true);
        try {
            await usuariosAdminService.crear(payload);
            onSuccess(`Usuario "${payload.nombre}" creado correctamente.`);
            onClose();
        } catch (err) {
            if (err.fieldErrors) {
                setErrores(err.fieldErrors);
            } else {
                setErrores({ general: err.message });
            }
        } finally {
            setGuardando(false);
        }
    }

    return (
        <Modal isOpen={isOpen} title="Registrar nuevo usuario" onClose={onClose}>
            <form className="form-stack" onSubmit={manejarSubmit} noValidate>
                {errores.general && (
                    <div className="alert-banner alert-error">{errores.general}</div>
                )}

                <div className="form-group">
                    <label className="form-label">Nombre completo *</label>
                    <input
                        type="text"
                        className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
                        value={form.nombre}
                        onChange={(e) => handleChange("nombre", e.target.value)}
                    />
                    {errores.nombre && <p className="field-error">{errores.nombre}</p>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Correo electrónico *</label>
                        <input
                            type="email"
                            className={`form-control ${errores.email ? "is-invalid" : ""}`}
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                        {errores.email && <p className="field-error">{errores.email}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Teléfono</label>
                        <input
                            type="tel"
                            className={`form-control ${errores.telefono ? "is-invalid" : ""}`}
                            value={form.telefono}
                            onChange={(e) => handleChange("telefono", e.target.value)}
                            placeholder="+5219511234567"
                        />
                        {errores.telefono && <p className="field-error">{errores.telefono}</p>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Contraseña *</label>
                        <input
                            type="password"
                            className={`form-control ${errores.password ? "is-invalid" : ""}`}
                            value={form.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            placeholder="Mín. 8 chars, Mayús, Núm, Especial"
                        />
                        {errores.password && <p className="field-error">{errores.password}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Rol del sistema *</label>
                        <select
                            className="form-control"
                            value={form.rol}
                            onChange={(e) => handleChange("rol", e.target.value)}
                        >
                            <option value="PACIENTE">Paciente</option>
                            <option value="DENTISTA">Odontólogo</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </div>
                </div>

                {form.rol === "DENTISTA" && (
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Especialidad</label>
                            <select
                                className="form-control"
                                value={form.especialidadId}
                                onChange={(e) => handleChange("especialidadId", e.target.value)}
                            >
                                <option value="">Odontología General</option>
                                {especialidades.map((esp) => (
                                    <option key={esp.id} value={esp.id}>
                                        {esp.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Cédula profesional</label>
                            <input
                                type="text"
                                className={`form-control ${errores.cedula ? "is-invalid" : ""}`}
                                value={form.cedula}
                                onChange={(e) => handleChange("cedula", e.target.value)}
                                placeholder="Ej. 12345678"
                            />
                            {errores.cedula && <p className="field-error">{errores.cedula}</p>}
                        </div>
                    </div>
                )}

                <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary" disabled={guardando}>
                        {guardando ? "Creando..." : "Crear usuario"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}