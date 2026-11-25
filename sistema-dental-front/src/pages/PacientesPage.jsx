import { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { pacientesService } from "../services/api";
import Pagination from "../components/Pagination";
import PacienteEditarModal from "../components/pacientes/PacienteEditarModal";

export default function PacientesPage() {
    const [pacientes, setPacientes] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [busqueda, setBusqueda] = useState("");
    const [debouncedQ, setDebouncedQ] = useState("");

    const [cargando, setCargando] = useState(true);
    const [errorRed, setErrorRed] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");
    const [pacienteEditando, setPacienteEditando] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQ(busqueda.trim());
            setPage(0);
        }, 350);
        return () => clearTimeout(timer);
    }, [busqueda]);

    async function cargarPacientes() {
        setCargando(true);
        setErrorRed("");
        try {
            const data = await pacientesService.listar({ page, size, q: debouncedQ });
            setPacientes(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setErrorRed(err.message);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarPacientes();
    }, [page, debouncedQ]);

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
                    <button className="btn-icon" onClick={cargarPacientes}>Reintentar</button>
                </div>
            )}

            <div className="page-toolbar">
                <div className="toolbar-filters">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar paciente por nombre o correo..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-card">
                {cargando ? (
                    <div className="state-box">
                        <div className="spinner"></div>
                        <p>Cargando listado de pacientes...</p>
                    </div>
                ) : pacientes.length === 0 ? (
                    <div className="state-box">
                        <p>No se encontraron pacientes registrados.</p>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Paciente</th>
                                        <th>Correo</th>
                                        <th>Teléfono</th>
                                        <th>Fecha Nac.</th>
                                        <th>Notas Médicas</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pacientes.map((p) => (
                                        <tr key={p.id}>
                                            <td><strong>{p.nombre}</strong></td>
                                            <td>{p.email}</td>
                                            <td>{p.telefono || "No registrado"}</td>
                                            <td>{p.fechaNacimiento || "—"}</td>
                                            <td style={{ maxWidth: "240px" }}>
                                                {p.notasMedicas || "Sin observaciones"}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn-icon"
                                                    onClick={() => setPacienteEditando(p)}
                                                >
                                                    Editar ficha
                                                </button>
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

            <PacienteEditarModal
                paciente={pacienteEditando}
                onClose={() => setPacienteEditando(null)}
                onSuccess={(msg) => {
                    setMensajeExito(msg);
                    cargarPacientes();
                }}
            />
        </div>
    );
}