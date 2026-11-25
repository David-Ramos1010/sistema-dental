import Modal from "../Modal";

const BADGE_ESTADO = {
    PROGRAMADA: "badge-warning",
    CONFIRMADA: "badge-info",
    COMPLETADA: "badge-success",
    CANCELADA: "badge-danger",
};

const ETIQUETA_ESTADO = {
    PROGRAMADA: "Programada",
    CONFIRMADA: "Confirmada",
    COMPLETADA: "Completada",
    CANCELADA: "Cancelada",
};

export default function CitaDetalleModal({ cita, formatearFecha, onClose }) {
    return (
        <Modal
            isOpen={Boolean(cita)}
            title={`Detalle de Cita #${cita?.id || ""}`}
            onClose={onClose}
        >
            {cita && (
                <div className="form-stack" style={{ fontSize: "14px", color: "#344054" }}>
                    <div>
                        <strong>Paciente:</strong> {cita.pacienteNombre}
                    </div>
                    <div>
                        <strong>Odontólogo:</strong> {cita.dentistaNombre} (
                        {cita.especialidad || "General"})
                    </div>
                    <div>
                        <strong>Fecha y hora:</strong> {formatearFecha(cita.fechaHora)}
                    </div>
                    <div>
                        <strong>Estado:</strong>{" "}
                        <span className={`badge ${BADGE_ESTADO[cita.estado] || "badge-neutral"}`}>
                            {ETIQUETA_ESTADO[cita.estado] || cita.estado}
                        </span>
                    </div>
                    <div>
                        <strong>Motivo:</strong> {cita.motivo}
                    </div>
                    {cita.notas && (
                        <div>
                            <strong>Notas:</strong> {cita.notas}
                        </div>
                    )}
                    <div>
                        <strong>Tratamientos incluidos:</strong>
                        {cita.tratamientos && cita.tratamientos.length > 0 ? (
                            <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
                                {cita.tratamientos.map((t) => (
                                    <li key={t.id}>
                                        {t.nombre} — ${Number(t.precio).toFixed(2)} (
                                        {t.duracionMin} min)
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <span> Consulta general (sin tratamientos extra)</span>
                        )}
                    </div>
                    <div
                        style={{
                            fontSize: "16px",
                            borderTop: "1px solid #eaecf0",
                            paddingTop: "10px",
                        }}
                    >
                        <strong>Total:</strong> ${Number(cita.total || 0).toFixed(2)}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-primary" onClick={onClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}