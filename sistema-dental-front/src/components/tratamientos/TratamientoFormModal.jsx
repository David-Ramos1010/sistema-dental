import { useEffect, useState } from "react";
import Modal from "../Modal";
import { tratamientosService } from "../../services/api";

const FORM_INICIAL = {
    nombre: "",
    descripcion: "",
    precio: "",
    duracionMin: "30",
    activo: true,
};

export default function TratamientoFormModal({ isOpen, tratamientoEditar, onClose, onSuccess }) {
    const [form, setForm] = useState(FORM_INICIAL);
    const [errores, setErrores] = useState({});
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        if (tratamientoEditar) {
            setForm({
                nombre: tratamientoEditar.nombre || "",
                descripcion: tratamientoEditar.descripcion || "",
                precio: tratamientoEditar.precio ?? "",
                duracionMin: tratamientoEditar.duracionMin ?? "30",
                activo: tratamientoEditar.activo,
            });
        } else {
            setForm(FORM_INICIAL);
        }
        setErrores({});
    }, [isOpen, tratamientoEditar]);

    function validarCampo(campo, valor) {
        if (campo === "nombre") {
            if (!valor.trim()) return "El nombre es obligatorio";
            if (valor.length > 100) return "Máximo 100 caracteres";
        }
        if (campo === "descripcion" && valor.length > 300) {
            return "Máximo 300 caracteres";
        }
        if (campo === "precio") {
            const num = Number(valor);
            if (valor === "" || Number.isNaN(num)) return "El precio es obligatorio";
            if (num < 0) return "El precio no puede ser negativo";
        }
        if (campo === "duracionMin") {
            const num = Number(valor);
            if (!valor || Number.isNaN(num)) return "La duración es obligatoria";
            if (num < 5 || num > 480) return "Debe ser entre 5 y 480 minutos";
        }
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
            descripcion: validarCampo("descripcion", form.descripcion),
            precio: validarCampo("precio", form.precio),
            duracionMin: validarCampo("duracionMin", form.duracionMin),
        };
        Object.keys(errs).forEach((k) => !errs[k] && delete errs[k]);
        setErrores(errs);
        if (Object.keys(errs).length > 0) return;

        const payload = {
            nombre: form.nombre.trim(),
            descripcion: form.descripcion.trim() || null,
            precio: Number(form.precio),
            duracionMin: Number(form.duracionMin),
            activo: Boolean(form.activo),
        };

        setGuardando(true);
        try {
            if (tratamientoEditar) {
                await tratamientosService.actualizar(tratamientoEditar.id, payload);
                onSuccess("Tratamiento actualizado correctamente.");
            } else {
                await tratamientosService.crear(payload);
                onSuccess("Tratamiento registrado correctamente.");
            }
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
            isOpen={isOpen}
            title={tratamientoEditar ? "Editar tratamiento" : "Nuevo tratamiento"}
            onClose={onClose}
        >
            <form className="form-stack" onSubmit={manejarSubmit} noValidate>
                {errores.general && (
                    <div className="alert-banner alert-error">{errores.general}</div>
                )}

                <div className="form-group">
                    <label className="form-label">Nombre del tratamiento *</label>
                    <input
                        type="text"
                        className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
                        value={form.nombre}
                        onChange={(e) => handleChange("nombre", e.target.value)}
                        placeholder="Ej. Limpieza dental profunda"
                    />
                    {errores.nombre && <p className="field-error">{errores.nombre}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea
                        rows="3"
                        className={`form-control ${errores.descripcion ? "is-invalid" : ""}`}
                        value={form.descripcion}
                        onChange={(e) => handleChange("descripcion", e.target.value)}
                        placeholder="Detalles del procedimiento..."
                    />
                    {errores.descripcion && <p className="field-error">{errores.descripcion}</p>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Precio (MXN) *</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className={`form-control ${errores.precio ? "is-invalid" : ""}`}
                            value={form.precio}
                            onChange={(e) => handleChange("precio", e.target.value)}
                            placeholder="500.00"
                        />
                        {errores.precio && <p className="field-error">{errores.precio}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Duración (minutos) *</label>
                        <input
                            type="number"
                            min="5"
                            max="480"
                            className={`form-control ${errores.duracionMin ? "is-invalid" : ""}`}
                            value={form.duracionMin}
                            onChange={(e) => handleChange("duracionMin", e.target.value)}
                        />
                        {errores.duracionMin && <p className="field-error">{errores.duracionMin}</p>}
                    </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        checked={form.activo}
                        onChange={(e) => handleChange("activo", e.target.checked)}
                    />
                    Tratamiento disponible para agendar citas
                </label>

                <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary" disabled={guardando}>
                        {guardando ? "Guardando..." : "Guardar tratamiento"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}