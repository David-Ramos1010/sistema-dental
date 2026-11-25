import { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { pacientesService } from "../services/api";

const REGEX_TELEFONO = /^\+[1-9]\d{7,14}$/;

export default function MiPerfilPage() {
    const [perfil, setPerfil] = useState(null);
    const [form, setForm] = useState({
        nombre: "",
        telefono: "",
        fechaNacimiento: "",
        direccion: "",
        notasMedicas: "",
    });

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [errorRed, setErrorRed] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");
    const [errores, setErrores] = useState({});

    async function cargarPerfil() {
        setCargando(true);
        setErrorRed("");
        try {
            const data = await pacientesService.miPerfil();
            setPerfil(data);
            setForm({
                nombre: data.nombre || "",
                telefono: data.telefono || "",
                fechaNacimiento: data.fechaNacimiento || "",
                direccion: data.direccion || "",
                notasMedicas: data.notasMedicas || "",
            });
        } catch (err) {
            setErrorRed(err.message);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarPerfil();
    }, []);

    function validarCampo(campo, valor) {
        if (campo === "nombre") {
            if (!valor.trim()) return "El nombre es obligatorio";
            if (valor.length > 100) return "Máximo 100 caracteres";
        }
        if (campo === "telefono" && valor.trim() !== "") {
            if (!REGEX_TELEFONO.test(valor.trim())) {
                return "Usa formato internacional, ej. +5219511234567";
            }
        }
        if (campo === "fechaNacimiento" && valor) {
            const hoy = new Date().toISOString().split("T")[0];
            if (valor >= hoy) return "La fecha de nacimiento debe ser pasada";
        }
        if (campo === "direccion" && valor.length > 200) {
            return "Máximo 200 caracteres";
        }
        if (campo === "notasMedicas" && valor.length > 500) {
            return "Máximo 500 caracteres";
        }
        return "";
    }

    function handleChange(campo, valor) {
        setForm((prev) => ({ ...prev, [campo]: valor }));
        const err = validarCampo(campo, valor);
        setErrores((prev) => ({ ...prev, [campo]: err }));
    }

    async function manejarGuardar(e) {
        e.preventDefault();
        setMensajeExito("");

        const errs = {
            nombre: validarCampo("nombre", form.nombre),
            telefono: validarCampo("telefono", form.telefono),
            fechaNacimiento: validarCampo("fechaNacimiento", form.fechaNacimiento),
            direccion: validarCampo("direccion", form.direccion),
            notasMedicas: validarCampo("notasMedicas", form.notasMedicas),
        };
        Object.keys(errs).forEach((k) => !errs[k] && delete errs[k]);
        setErrores(errs);
        if (Object.keys(errs).length > 0) return;

        const payload = {
            nombre: form.nombre.trim(),
            telefono: form.telefono.trim() !== "" ? form.telefono.trim() : null,
            fechaNacimiento: form.fechaNacimiento || null,
            direccion: form.direccion.trim() !== "" ? form.direccion.trim() : null,
            notasMedicas: form.notasMedicas.trim() !== "" ? form.notasMedicas.trim() : null,
        };

        setGuardando(true);
        try {
            const actualizado = await pacientesService.actualizarMiPerfil(payload);
            setPerfil(actualizado);
            setMensajeExito("Tu perfil se ha actualizado correctamente.");
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

    if (cargando) {
        return (
            <div className="table-card">
                <div className="state-box">
                    <div className="spinner"></div>
                    <p>Cargando información de tu perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ maxWidth: "720px" }}>
            {errorRed && (
                <div className="alert-banner alert-error">
                    <span>{errorRed}</span>
                    <button className="btn-icon" onClick={cargarPerfil}>Reintentar</button>
                </div>
            )}

            {mensajeExito && (
                <div className="alert-banner alert-success">
                    <span>{mensajeExito}</span>
                    <button className="btn-icon" onClick={() => setMensajeExito("")}>✕</button>
                </div>
            )}

            <div className="table-card" style={{ padding: "24px" }}>
                <form className="form-stack" onSubmit={manejarGuardar} noValidate>
                    {errores.general && (
                        <div className="alert-banner alert-error">{errores.general}</div>
                    )}

                    <div className="form-row">
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

                        <div className="form-group">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                value={perfil?.email || ""}
                                disabled
                                style={{ backgroundColor: "#f9fafb", color: "#667085" }}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Teléfono (SMS y WhatsApp)</label>
                            <input
                                type="tel"
                                className={`form-control ${errores.telefono ? "is-invalid" : ""}`}
                                value={form.telefono}
                                onChange={(e) => handleChange("telefono", e.target.value)}
                                placeholder="+5219511234567"
                            />
                            {errores.telefono && <p className="field-error">{errores.telefono}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Fecha de nacimiento</label>
                            <input
                                type="date"
                                className={`form-control ${errores.fechaNacimiento ? "is-invalid" : ""}`}
                                value={form.fechaNacimiento}
                                onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                            />
                            {errores.fechaNacimiento && (
                                <p className="field-error">{errores.fechaNacimiento}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Dirección</label>
                        <input
                            type="text"
                            className={`form-control ${errores.direccion ? "is-invalid" : ""}`}
                            value={form.direccion}
                            onChange={(e) => handleChange("direccion", e.target.value)}
                            placeholder="Calle, número, colonia y ciudad"
                        />
                        {errores.direccion && <p className="field-error">{errores.direccion}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Notas médicas / Alergias</label>
                        <textarea
                            rows="4"
                            className={`form-control ${errores.notasMedicas ? "is-invalid" : ""}`}
                            value={form.notasMedicas}
                            onChange={(e) => handleChange("notasMedicas", e.target.value)}
                            placeholder="Alergias a medicamentos, anestesia o condiciones relevantes..."
                        />
                        {errores.notasMedicas && (
                            <p className="field-error">{errores.notasMedicas}</p>
                        )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button type="submit" className="btn-primary" disabled={guardando}>
                            {guardando ? "Guardando cambios..." : "Guardar mi perfil"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}