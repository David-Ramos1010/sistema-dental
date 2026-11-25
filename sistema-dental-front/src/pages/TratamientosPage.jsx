import { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { tratamientosService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/ConfirmModal";
import TratamientoFormModal from "../components/tratamientos/TratamientoFormModal";

export default function TratamientosPage() {
    const { usuario } = useAuth();
    const esAdmin = usuario?.rol === "ADMIN";

    const [tratamientos, setTratamientos] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [busqueda, setBusqueda] = useState("");
    const [debouncedQ, setDebouncedQ] = useState("");
    const [filtroActivo, setFiltroActivo] = useState("");

    const [cargando, setCargando] = useState(true);
    const [errorRed, setErrorRed] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");

    const [modalAbierto, setModalAbierto] = useState(false);
    const [tratamientoEditar, setTratamientoEditar] = useState(null);
    const [tratamientoAEliminar, setTratamientoAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQ(busqueda.trim());
            setPage(0);
        }, 350);
        return () => clearTimeout(timer);
    }, [busqueda]);

    async function cargarTratamientos() {
        setCargando(true);
        setErrorRed("");
        try {
            const data = await tratamientosService.listar({
                page,
                size,
                q: debouncedQ,
                activo: filtroActivo === "" ? undefined : filtroActivo === "true",
            });
            setTratamientos(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setErrorRed(err.message);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarTratamientos();
    }, [page, debouncedQ, filtroActivo]);

    async function confirmarEliminar() {
        if (!tratamientoAEliminar) return;
        setEliminando(true);
        try {
            await tratamientosService.eliminar(tratamientoAEliminar.id);
            setMensajeExito(`Tratamiento "${tratamientoAEliminar.nombre}" eliminado.`);
            setTratamientoAEliminar(null);
            cargarTratamientos();
        } catch (err) {
            setErrorRed(err.message);
            setTratamientoAEliminar(null);
        } finally {
            setEliminando(false);
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
                    <button className="btn-icon" onClick={cargarTratamientos}>Reintentar</button>
                </div>
            )}

            <div className="page-toolbar">
                <div className="toolbar-filters">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar tratamiento por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <select
                        className="filter-select"
                        value={filtroActivo}
                        onChange={(e) => {
                            setFiltroActivo(e.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="">Todos los estados</option>
                        <option value="true">Activos</option>
                        <option value="false">Inactivos</option>
                    </select>
                </div>

                {esAdmin && (
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                            setTratamientoEditar(null);
                            setModalAbierto(true);
                        }}
                    >
                        + Nuevo tratamiento
                    </button>
                )}
            </div>

            <div className="table-card">
                {cargando ? (
                    <div className="state-box">
                        <div className="spinner"></div>
                        <p>Cargando catálogo de tratamientos...</p>
                    </div>
                ) : tratamientos.length === 0 ? (
                    <div className="state-box">
                        <p>No se encontraron tratamientos con los filtros seleccionados.</p>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tratamiento</th>
                                        <th>Descripción</th>
                                        <th>Duración</th>
                                        <th>Precio</th>
                                        <th>Estado</th>
                                        {esAdmin && <th>Acciones</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tratamientos.map((t) => (
                                        <tr key={t.id}>
                                            <td><strong>{t.nombre}</strong></td>
                                            <td>{t.descripcion || "Sin descripción"}</td>
                                            <td>{t.duracionMin} min</td>
                                            <td>${Number(t.precio).toFixed(2)}</td>
                                            <td>
                                                <span className={`badge ${t.activo ? "badge-success" : "badge-neutral"}`}>
                                                    {t.activo ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            {esAdmin && (
                                                <td>
                                                    <div className="actions-cell">
                                                        <button
                                                            type="button"
                                                            className="btn-icon"
                                                            onClick={() => {
                                                                setTratamientoEditar(t);
                                                                setModalAbierto(true);
                                                            }}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn-icon danger"
                                                            onClick={() => setTratamientoAEliminar(t)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
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

            <TratamientoFormModal
                isOpen={modalAbierto}
                tratamientoEditar={tratamientoEditar}
                onClose={() => setModalAbierto(false)}
                onSuccess={(msg) => {
                    setMensajeExito(msg);
                    cargarTratamientos();
                }}
            />

            <ConfirmModal
                isOpen={Boolean(tratamientoAEliminar)}
                title="Eliminar tratamiento"
                message={`¿Estás seguro de que deseas eliminar el tratamiento "${tratamientoAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
                confirmText="Sí, eliminar"
                loading={eliminando}
                onConfirm={confirmarEliminar}
                onClose={() => setTratamientoAEliminar(null)}
            />
        </div>
    );
}