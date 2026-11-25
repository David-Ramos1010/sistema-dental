import { useEffect, useState } from "react";
import Modal from "../Modal";
import {
    citasService,
    catalogoService,
    pacientesService,
    tratamientosService,
} from "../../services/api";

const FORM_INICIAL = {
    pacienteId: "",
    dentistaId: "",
    fechaHora: "",
    motivo: "",
    notas: "",
    tratamientoIds: [],
};

function obtenerMinDateTimeLocal() {
    const ahora = new Date(Date.now() + 5 * 60 * 1000);
    const offset = ahora.getTimezoneOffset() * 60000;
    return new Date(ahora.getTime() - offset).toISOString().slice(0, 16);
}

export default function CitaFormModal({
    isOpen,
    citaEditar,
    esPersonal,
    onClose,
    onSuccess,
}) {
    const [form, setForm] = useState(FORM_INICIAL);
    const [errores, setErrores] = useState({});
    const [guardando, setGuardando] = useState(false);

    const [dentistas, setDentistas] = useState([]);
    const [tratamientos, setTratamientos] = useState([]);
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        if (!isOpen) return;

        // Cargar catálogos al abrir el modal
        const promesas = [
            catalogoService.listarDentistas({ page: 0, size: 100 }),
            tratamientosService.listar({ page: 0, size: 100, activo: true }),
        ];
        if (esPersonal) {
            promesas.push(pacientesService.listar({ page: 0, size: 100 }));
        }

        Promise.all(promesas)
            .then(([resDentistas, resTratamientos, resPacientes]) => {
                setDentistas(resDentistas?.content || []);
                setTratamientos(resTratamientos?.content || []);
                if (resPacientes) setPacientes(resPacientes.content || []);
            })
            .catch(() => {});

        // Inicializar formulario (crear vs editar)
        if (citaEditar) {
            setForm({
                pacienteId: citaEditar.pacienteId ? String(citaEditar.pacienteId) : "",
                dentistaId: citaEditar.dentistaId ? String(citaEditar.dentistaId) : "",
                fechaHora: citaEditar.fechaHora ? citaEditar.fechaHora.slice(0, 16) : "",
                motivo: citaEditar.motivo || "",
                notas: citaEditar.notas || "",
                tratamientoIds: (citaEditar.tratamientos || []).map((t) => t.id),
            });
        } else {
            setForm(FORM_INICIAL);
        }
        setErrores({});
    }, [isOpen, citaEditar, esPersonal]);

    function validarCampo(campo, valor) {
        if (campo === "pacienteId" && esPersonal && !valor) {
            return "Selecciona un paciente";
        }
        if (campo === "dentistaId" && !valor) {
            return "El dentista es obligatorio";
        }
        if (campo === "fechaHora") {
            if (!valor) return "La fecha y hora son obligatorias";
            if (new Date(valor) <= new Date()) return "La fecha y hora deben ser futuras";
        }
        if (campo === "motivo") {
            if (!valor.trim()) return "El motivo es obligatorio";
            if (valor.length > 200) return "El motivo no puede exceder 200 caracteres";
        }
        if (campo === "notas" && valor.length > 500) {
            return "Las notas no pueden exceder 500 caracteres";
        }
        return "";
    }

    function handleChange(campo, valor) {
        setForm((prev) => ({ ...prev, [campo]: valor }));
        const err = validarCampo(campo, valor);
        setErrores((prev) => ({ ...prev, [campo]: err }));
    }

    function toggleTratamiento(id) {
        setForm((prev) => {
            const existe = prev.tratamientoIds.includes(id);
            const nuevos = existe
                ? prev.tratamientoIds.filter((item) => item !== id)
                : [...prev.tratamientoIds, id];
            return { ...prev, tratamientoIds: nuevos };
        });
    }

    async function manejarSubmit(e) {
        e.preventDefault();
        const errs = {
            pacienteId: validarCampo("pacienteId", form.pacienteId),
            dentistaId: validarCampo("dentistaId", form.dentistaId),
            fechaHora: validarCampo("fechaHora", form.fechaHora),
            motivo: validarCampo("motivo", form.motivo),
            notas: validarCampo("notas", form.notas),
        };
        Object.keys(errs).forEach((k) => !errs[k] && delete errs[k]);
        setErrores(errs);
        if (Object.keys(errs).length > 0) return;

        const fechaFormateada =
            form.fechaHora.length === 16 ? `${form.fechaHora}:00` : form.fechaHora;

        const payload = {
            pacienteId: esPersonal && form.pacienteId ? Number(form.pacienteId) : null,
            dentistaId: Number(form.dentistaId),
            fechaHora: fechaFormateada,
            motivo: form.motivo.trim(),
            notas: form.notas.trim() !== "" ? form.notas.trim() : null,
            tratamientoIds: form.tratamientoIds,
        };

        setGuardando(true);
        try {
            if (citaEditar) {
                await citasService.actualizar(citaEditar.id, payload);
                onSuccess("Cita reprogramada correctamente.");
            } else {
                await citasService.crear(payload);
                onSuccess("Cita agendada correctamente. Se enviaron las notificaciones correspondientes.");
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

    const totalEstimado = tratamientos
        .filter((t) => form.tratamientoIds.includes(t.id))
        .reduce((acc, t) => acc + Number(t.precio || 0), 0);

    return (
        <Modal
            isOpen={isOpen}
            title={citaEditar ? "Reprogramar / Editar cita" : "Agendar nueva cita"}
            onClose={onClose}
        >
            <form className="form-stack" onSubmit={manejarSubmit} noValidate>
                {errores.general && (
                    <div className="alert-banner alert-error">{errores.general}</div>
                )}

                {esPersonal && (
                    <div className="form-group">
                        <label className="form-label">Paciente *</label>
                        <select
                            className={`form-control ${errores.pacienteId ? "is-invalid" : ""}`}
                            value={form.pacienteId}
                            onChange={(e) => handleChange("pacienteId", e.target.value)}
                            disabled={Boolean(citaEditar)}
                        >
                            <option value="">Selecciona un paciente...</option>
                            {pacientes.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} ({p.email})
                                </option>
                            ))}
                        </select>
                        {errores.pacienteId && <p className="field-error">{errores.pacienteId}</p>}
                    </div>
                )}

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Odontólogo *</label>
                        <select
                            className={`form-control ${errores.dentistaId ? "is-invalid" : ""}`}
                            value={form.dentistaId}
                            onChange={(e) => handleChange("dentistaId", e.target.value)}
                        >
                            <option value="">Selecciona un odontólogo...</option>
                            {dentistas.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.nombre} — {d.especialidad || "General"}
                                </option>
                            ))}
                        </select>
                        {errores.dentistaId && <p className="field-error">{errores.dentistaId}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Fecha y hora *</label>
                        <input
                            type="datetime-local"
                            min={obtenerMinDateTimeLocal()}
                            className={`form-control ${errores.fechaHora ? "is-invalid" : ""}`}
                            value={form.fechaHora}
                            onChange={(e) => handleChange("fechaHora", e.target.value)}
                        />
                        {errores.fechaHora && <p className="field-error">{errores.fechaHora}</p>}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Motivo de la consulta *</label>
                    <input
                        type="text"
                        className={`form-control ${errores.motivo ? "is-invalid" : ""}`}
                        value={form.motivo}
                        onChange={(e) => handleChange("motivo", e.target.value)}
                        placeholder="Ej. Dolor en molar derecho o revisión semestral"
                    />
                    {errores.motivo && <p className="field-error">{errores.motivo}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Tratamientos asociados (opcional)</label>
                    <div
                        style={{
                            maxHeight: "150px",
                            overflowY: "auto",
                            border: "1px solid #d0d5dd",
                            borderRadius: "8px",
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        {tratamientos.length === 0 ? (
                            <span style={{ fontSize: "13px", color: "#667085" }}>
                                No hay tratamientos activos disponibles.
                            </span>
                        ) : (
                            tratamientos.map((t) => (
                                <label
                                    key={t.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="checkbox"
                                            checked={form.tratamientoIds.includes(t.id)}
                                            onChange={() => toggleTratamiento(t.id)}
                                        />
                                        {t.nombre} ({t.duracionMin} min)
                                    </span>
                                    <strong>${Number(t.precio).toFixed(2)}</strong>
                                </label>
                            ))
                        )}
                    </div>
                    {form.tratamientoIds.length > 0 && (
                        <div style={{ textAlign: "right", fontSize: "14px", color: "#344054" }}>
                            Total estimado: <strong>${totalEstimado.toFixed(2)}</strong>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Notas adicionales</label>
                    <textarea
                        rows="2"
                        className={`form-control ${errores.notas ? "is-invalid" : ""}`}
                        value={form.notas}
                        onChange={(e) => handleChange("notas", e.target.value)}
                        placeholder="Indicaciones previas o comentarios..."
                    />
                    {errores.notas && <p className="field-error">{errores.notas}</p>}
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary" disabled={guardando}>
                        {guardando
                            ? "Guardando..."
                            : citaEditar
                            ? "Guardar cambios"
                            : "Agendar cita"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}