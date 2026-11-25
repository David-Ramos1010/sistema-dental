import { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { citasService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/ConfirmModal";
import CitaFormModal from "../components/citas/CitaFormModal";
import CitaDetalleModal from "../components/citas/CitaDetalleModal";

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

function formatearFechaHora(isoString) {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function CitasPage() {
    const { usuario } = useAuth();
    const esAdmin = usuario?.rol === "ADMIN";
    const esPersonal = esAdmin || usuario?.rol === "DENTISTA";

    // Listado y paginación
    const [citas, setCitas] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Filtros
    const [busqueda, setBusqueda] = useState("");
    const [debouncedQ, setDebouncedQ] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    // Estados UI
    const [cargando, setCargando] = useState(true);
    const [errorRed, setErrorRed] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");

    // Control de modales
    const [modalFormAbierto, setModalFormAbierto] = useState(false);
    const [citaEditar, setCitaEditar] = useState(null);
    const [citaDetalle, setCitaDetalle] = useState(null);
    const [accionConfirmar, setAccionConfirmar] = useState(null);
    const [procesandoAccion, setProcesandoAccion] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQ(busqueda.trim());
            setPage(0);
        }, 350);
        return () => clearTimeout(timer);
    }, [busqueda]);

    async function cargarCitas() {
        setCargando(true);
        setErrorRed("");
        try {
            const data = await citasService.listar({
                page,
                size,
                q: debouncedQ,
                estado: filtroEstado || undefined,
                desde: fechaDesde || undefined,
                hasta: fechaHasta || undefined,
            });
            setCitas(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setErrorRed(err.message);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarCitas();
    }, [page, debouncedQ, filtroEstado, fechaDesde, fechaHasta]);

    function solicitarCambioEstado(cita, nuevoEstado) {
        const config = {
            CONFIRMADA: {
                titulo: "Confirmar cita",
                mensaje: `¿Confirmar la cita de ${cita.pacienteNombre} con ${cita.dentistaNombre}? Se notificará al paciente.`,
                variante: "primary",
                textoBtn: "Sí, confirmar",
            },
            COMPLETADA: {
                titulo: "Completar cita",
                mensaje: `¿Marcar la cita de ${cita.pacienteNombre} como atendida y completada?`,
                variante: "primary",
                textoBtn: "Sí, completar",
            },
            CANCELADA: {
                titulo: "Cancelar cita",
                mensaje: `¿Estás seguro de cancelar la cita del ${formatearFechaHora(cita.fechaHora)}?`,
                variante: "danger",
                textoBtn: "Sí, cancelar cita",
            },
        };
        setAccionConfirmar({ tipo: "ESTADO", cita, nuevoEstado, ...config[nuevoEstado] });
    }

    function solicitarEliminarCita(cita) {
        setAccionConfirmar({
            tipo: "ELIMINAR",
            cita,
            titulo: "Eliminar registro de cita",
            mensaje: `¿Eliminar permanentemente la cita #${cita.id} de ${cita.pacienteNombre}?`,
            variante: "danger",
            textoBtn: "Sí, eliminar",
        });
    }

    async function ejecutarAccionConfirmada() {
        if (!accionConfirmar) return;
        setProcesandoAccion(true);
        try {
            if (accionConfirmar.tipo === "ESTADO") {
                await citasService.cambiarEstado(
                    accionConfirmar.cita.id,
                    accionConfirmar.nuevoEstado
                );
                setMensajeExito(
                    `Estado actualizado a ${ETIQUETA_ESTADO[accionConfirmar.nuevoEstado]}.`
                );
            } else {
                await citasService.eliminar(accionConfirmar.cita.id);
                setMensajeExito("Cita eliminada del sistema.");
            }
            setAccionConfirmar(null);
            cargarCitas();
        } catch (err) {
            setErrorRed(err.message);
            setAccionConfirmar(null);
        } finally {
            setProcesandoAccion(false);
        }
    }

    return (
        <div className="page-container">
            {mensajeExito && (
                <div className="alert-banner alert-success">
                    <span>{mensajeExito}</span>
                    <button className="btn-icon" onClick={() => setMensajeExito("")}>✕</button>
                </div>
            )}

            {errorRed && (
                <div className="alert-banner alert-error">
                    <span>{errorRed}</span>
                    <button className="btn-icon" onClick={cargarCitas}>Reintentar</button>
                </div>
            )}

            <div className="page-toolbar">
                <div className="toolbar-filters">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar por paciente, dentista o motivo..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <select
                        className="filter-select"
                        value={filtroEstado}
                        onChange={(e) => {
                            setFiltroEstado(e.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="">Todos los estados</option>
                        <option value="PROGRAMADA">Programadas</option>
                        <option value="CONFIRMADA">Confirmadas</option>
                        <option value="COMPLETADA">Completadas</option>
                        <option value="CANCELADA">Canceladas</option>
                    </select>
                    <input
                        type="date"
                        className="filter-date"
                        value={fechaDesde}
                        onChange={(e) => {
                            setFechaDesde(e.target.value);
                            setPage(0);
                        }}
                    />
                    <input
                        type="date"
                        className="filter-date"
                        value={fechaHasta}
                        onChange={(e) => {
                            setFechaHasta(e.target.value);
                            setPage(0);
                        }}
                    />
                    {(busqueda || filtroEstado || fechaDesde || fechaHasta) && (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                                setBusqueda("");
                                setFiltroEstado("");
                                setFechaDesde("");
                                setFechaHasta("");
                                setPage(0);
                            }}
                        >
                            Limpiar
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                        setCitaEditar(null);
                        setModalFormAbierto(true);
                    }}
                >
                    + Agendar cita
                </button>
            </div>

            <div className="table-card">
                {cargando ? (
                    <div className="state-box">
                        <div className="spinner"></div>
                        <p>Cargando citas odontológicas...</p>
                    </div>
                ) : citas.length === 0 ? (
                    <div className="state-box">
                        <p>No hay citas registradas con los filtros seleccionados.</p>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Fecha y Hora</th>
                                        {esPersonal && <th>Paciente</th>}
                                        <th>Odontólogo</th>
                                        <th>Motivo</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {citas.map((c) => {
                                        const esActiva =
                                            c.estado === "PROGRAMADA" || c.estado === "CONFIRMADA";
                                        return (
                                            <tr key={c.id}>
                                                <td><strong>{formatearFechaHora(c.fechaHora)}</strong></td>
                                                {esPersonal && <td>{c.pacienteNombre}</td>}
                                                <td>
                                                    <div>{c.dentistaNombre}</div>
                                                    <small style={{ color: "#667085" }}>
                                                        {c.especialidad || "General"}
                                                    </small>
                                                </td>
                                                <td style={{ maxWidth: "220px" }}>{c.motivo}</td>
                                                <td>${Number(c.total || 0).toFixed(2)}</td>
                                                <td>
                                                    <span className={`badge ${BADGE_ESTADO[c.estado] || "badge-neutral"}`}>
                                                        {ETIQUETA_ESTADO[c.estado] || c.estado}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="actions-cell">
                                                        <button
                                                            type="button"
                                                            className="btn-icon"
                                                            onClick={() => setCitaDetalle(c)}
                                                        >
                                                            Ver
                                                        </button>
                                                        {esActiva && (
                                                            <button
                                                                type="button"
                                                                className="btn-icon"
                                                                onClick={() => {
                                                                    setCitaEditar(c);
                                                                    setModalFormAbierto(true);
                                                                }}
                                                            >
                                                                Editar
                                                            </button>
                                                        )}
                                                        {esPersonal && c.estado === "PROGRAMADA" && (
                                                            <button
                                                                type="button"
                                                                className="btn-icon success"
                                                                onClick={() => solicitarCambioEstado(c, "CONFIRMADA")}
                                                            >
                                                                Confirmar
                                                            </button>
                                                        )}
                                                        {esPersonal && esActiva && (
                                                            <button
                                                                type="button"
                                                                className="btn-icon success"
                                                                onClick={() => solicitarCambioEstado(c, "COMPLETADA")}
                                                            >
                                                                Completar
                                                            </button>
                                                        )}
                                                        {esActiva && (
                                                            <button
                                                                type="button"
                                                                className="btn-icon danger"
                                                                onClick={() => solicitarCambioEstado(c, "CANCELADA")}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        )}
                                                        {esAdmin && (
                                                            <button
                                                                type="button"
                                                                className="btn-icon danger"
                                                                onClick={() => solicitarEliminarCita(c)}
                                                            >
                                                                Eliminar
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            totalElements={totalElements}
                            size={size}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>

            <CitaFormModal
                isOpen={modalFormAbierto}
                citaEditar={citaEditar}
                esPersonal={esPersonal}
                onClose={() => setModalFormAbierto(false)}
                onSuccess={(msg) => {
                    setMensajeExito(msg);
                    cargarCitas();
                }}
            />

            <CitaDetalleModal
                cita={citaDetalle}
                formatearFecha={formatearFechaHora}
                onClose={() => setCitaDetalle(null)}
            />

            <ConfirmModal
                isOpen={Boolean(accionConfirmar)}
                title={accionConfirmar?.titulo}
                message={accionConfirmar?.mensaje}
                confirmText={accionConfirmar?.textoBtn}
                variant={accionConfirmar?.variante}
                loading={procesandoAccion}
                onConfirm={ejecutarAccionConfirmada}
                onClose={() => setAccionConfirmar(null)}
            />
        </div>
    );
}