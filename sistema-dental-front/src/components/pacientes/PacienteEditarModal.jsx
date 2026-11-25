import { useEffect, useState } from "react";
import Modal from "../Modal";
import { pacientesService } from "../../services/api";

const REGEX_TELEFONO = /^\+[1-9]\d{7,14}$/;

export default function PacienteEditarModal({ paciente, onClose, onSuccess }) {
    const [form, setForm] = useState({
        nombre: "",
        telefono: "",
        fechaNacimiento: "",
        direccion: "",
        notasMedicas: "",
    });
    const [errores, setErrores] = useState({});
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (!paciente) return;
        setForm({
            nombre: paciente.nombre || "",
            telefono: paciente.telefono || "",
            fechaNacimiento: paciente.fechaNacimiento || "",
            direccion: paciente.direccion || "",
            notasMedicas: paciente.notasMedicas || "",
        });
        setErrores({});
    }, [paciente]);

    function validarCampo(campo, valor) {
        if (campo === "nombre" && !valor.trim()) return "El nombre es obligatorio";
        if (campo === "telefono" && valor.trim() !== "" && !REGEX_TELEFONO.test(valor.trim())) {
            return "Usa formato internacional, ej. +5219511234567";
        }
        if (campo === "fechaNacimiento" && valor) {
            const hoy = new Date().toISOString().split("T")[0];
            if (valor >= hoy) return "La fecha de nacimiento debe ser pasada";
        }
        if (campo === "direccion" && valor.length > 200) return "Máximo 200 caracteres";
        if (campo === "notasMedicas" && valor.length > 500) return "Máximo 500 caracteres";
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
            await pacientesService.actualizar(paciente.id, payload);
            onSuccess(`Expediente de ${form.nombre} actualizado.`);
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
        <Modal
            isOpen={Boolean(paciente)}
            title={`Ficha del paciente: ${paciente?.nombre || ""}`}
            onClose={onClose}
        >
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
                    />
                    {errores.direccion && <p className="field-error">{errores.direccion}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Notas médicas / Alergias</label>
                    <textarea
                        rows="3"
                        className={`form-control ${errores.notasMedicas ? "is-invalid" : ""}`}
                        value={form.notasMedicas}
                        onChange={(e) => handleChange("notasMedicas", e.target.value)}
                    />
                    {errores.notasMedicas && (
                        <p className="field-error">{errores.notasMedicas}</p>
                    )}
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary" disabled={guardando}>
                        {guardando ? "Guardando..." : "Actualizar ficha"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}