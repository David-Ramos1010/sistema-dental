import { useEffect, useState } from "react";
import Modal from "../Modal";
import { usuariosAdminService } from "../../services/api";

const REGEX_TELEFONO = /^\+[1-9]\d{7,14}$/;

export default function UsuarioEditarModal({ usuario, onClose, onSuccess }) {
    const [form, setForm] = useState({ nombre: "", telefono: "" });
    const [errores, setErrores] = useState({});
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (!usuario) return;
        setForm({
            nombre: usuario.nombre || "",
            telefono: usuario.telefono || "",
        });
        setErrores({});
    }, [usuario]);

    async function manejarSubmit(e) {
        e.preventDefault();
        const errs = {};
        if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio";
        if (form.telefono.trim() !== "" && !REGEX_TELEFONO.test(form.telefono.trim())) {
            errs.telefono = "Usa formato internacional, ej. +5219511234567";
        }
        setErrores(errs);
        if (Object.keys(errs).length > 0) return;

        setGuardando(true);
        try {
            await usuariosAdminService.actualizar(usuario.id, {
                nombre: form.nombre.trim(),
                telefono: form.telefono.trim() !== "" ? form.telefono.trim() : null,
            });
            onSuccess("Usuario actualizado correctamente.");
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
            isOpen={Boolean(usuario)}
            title={`Editar usuario: ${usuario?.email || ""}`}
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
                        onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
                    />
                    {errores.nombre && <p className="field-error">{errores.nombre}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input
                        type="tel"
                        className={`form-control ${errores.telefono ? "is-invalid" : ""}`}
                        value={form.telefono}
                        onChange={(e) => setForm((prev) => ({ ...prev, telefono: e.target.value }))}
                        placeholder="+5219511234567"
                    />
                    {errores.telefono && <p className="field-error">{errores.telefono}</p>}
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary" disabled={guardando}>
                        {guardando ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}