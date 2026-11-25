import { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { usuariosAdminService } from "../services/api";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/ConfirmModal";
import UsuarioCrearModal from "../components/usuarios/UsuarioCrearModal";
import UsuarioEditarModal from "../components/usuarios/UsuarioEditarModal";

const BADGE_ROL = {
    ADMIN: "badge-purple",
    DENTISTA: "badge-info",
    PACIENTE: "badge-neutral",
};

export default function UsuariosAdminPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Filtros en servidor
    const [busqueda, setBusqueda] = useState("");
    const [debouncedQ, setDebouncedQ] = useState("");
    const [filtroRol, setFiltroRol] = useState("");
    const [filtroActivo, setFiltroActivo] = useState("");

    // Estados UI
    const [cargando, setCargando] = useState(true);
    const [errorRed, setErrorRed] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");

    // Control de modales
    const [modalCrear, setModalCrear] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [usuarioEstado, setUsuarioEstado] = useState(null);
    const [cambiandoEstado, setCambiandoEstado] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQ(busqueda.trim());
            setPage(0);
        }, 350);
        return () => clearTimeout(timer);
    }, [busqueda]);

    async function cargarUsuarios() {
        setCargando(true);
        setErrorRed("");
        try {
            const data = await usuariosAdminService.listar({
                page,
                size,
                q: debouncedQ,
                rol: filtroRol || undefined,
                activo: filtroActivo === "" ? undefined : filtroActivo === "true",
            });
            setUsuarios(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setErrorRed(err.message);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarUsuarios();
    }, [page, debouncedQ, filtroRol, filtroActivo]);

    async function confirmarCambioActivo() {
        if (!usuarioEstado) return;
        const nuevoEstado = !usuarioEstado.activo;
        setCambiandoEstado(true);
        try {
            await usuariosAdminService.cambiarActivo(usuarioEstado.id, nuevoEstado);
            setMensajeExito(
                `Cuenta de ${usuarioEstado.nombre} ${nuevoEstado ? "activada" : "desactivada"}.`
            );
            setUsuarioEstado(null);
            cargarUsuarios();
        } catch (err) {
            setErrorRed(err.message);
            setUsuarioEstado(null);
        } finally {
            setCambiandoEstado(false);
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
                    <button className="btn-icon" onClick={cargarUsuarios}>Reintentar</button>
                </div>
            )}

            <div className="page-toolbar">
                <div className="toolbar-filters">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar por nombre o correo..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <select
                        className="filter-select"
                        value={filtroRol}
                        onChange={(e) => {
                            setFiltroRol(e.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="">Todos los roles</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="DENTISTA">Odontólogo</option>
                        <option value="PACIENTE">Paciente</option>
                    </select>
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

                <button type="button" className="btn-primary" onClick={() => setModalCrear(true)}>
                    + Nuevo usuario
                </button>
            </div>

            <div className="table-card">
                {cargando ? (
                    <div className="state-box">
                        <div className="spinner"></div>
                        <p>Cargando usuarios del sistema...</p>
                    </div>
                ) : usuarios.length === 0 ? (
                    <div className="state-box">
                        <p>No se encontraron usuarios con los filtros actuales.</p>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Teléfono</th>
                                        <th>Rol</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((u) => (
                                        <tr key={u.id}>
                                            <td><strong>{u.nombre}</strong></td>
                                            <td>{u.email}</td>
                                            <td>{u.telefono || "—"}</td>
                                            <td>
                                                <span className={`badge ${BADGE_ROL[u.rol] || "badge-neutral"}`}>
                                                    {u.rol}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${u.activo ? "badge-success" : "badge-danger"}`}>
                                                    {u.activo ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions-cell">
                                                    <button
                                                        type="button"
                                                        className="btn-icon"
                                                        onClick={() => setUsuarioEditando(u)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`btn-icon ${u.activo ? "danger" : "success"}`}
                                                        onClick={() => setUsuarioEstado(u)}
                                                    >
                                                        {u.activo ? "Desactivar" : "Activar"}
                                                    </button>
                                                </div>
                                            </td>
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

            <UsuarioCrearModal
                isOpen={modalCrear}
                onClose={() => setModalCrear(false)}
                onSuccess={(msg) => {
                    setMensajeExito(msg);
                    cargarUsuarios();
                }}
            />

            <UsuarioEditarModal
                usuario={usuarioEditando}
                onClose={() => setUsuarioEditando(null)}
                onSuccess={(msg) => {
                    setMensajeExito(msg);
                    cargarUsuarios();
                }}
            />

            <ConfirmModal
                isOpen={Boolean(usuarioEstado)}
                title={usuarioEstado?.activo ? "Desactivar usuario" : "Activar usuario"}
                message={`¿Deseas ${usuarioEstado?.activo ? "desactivar" : "activar"} el acceso de ${usuarioEstado?.nombre}?`}
                confirmText={usuarioEstado?.activo ? "Sí, desactivar" : "Sí, activar"}
                variant={usuarioEstado?.activo ? "danger" : "primary"}
                loading={cambiandoEstado}
                onConfirm={confirmarCambioActivo}
                onClose={() => setUsuarioEstado(null)}
            />
        </div>
    );
}