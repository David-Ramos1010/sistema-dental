import { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { catalogoService } from "../services/api";
import Pagination from "../components/Pagination";

export default function DentistasPage() {
    const [dentistas, setDentistas] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [busqueda, setBusqueda] = useState("");
    const [debouncedQ, setDebouncedQ] = useState("");
    const [especialidadId, setEspecialidadId] = useState("");

    const [cargando, setCargando] = useState(true);
    const [errorRed, setErrorRed] = useState("");

    useEffect(() => {
        catalogoService.listarEspecialidades()
            .then((lista) => setEspecialidades(lista || []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQ(busqueda.trim());
            setPage(0);
        }, 350);
        return () => clearTimeout(timer);
    }, [busqueda]);

    async function cargarDentistas() {
        setCargando(true);
        setErrorRed("");
        try {
            const data = await catalogoService.listarDentistas({
                page,
                size,
                q: debouncedQ,
                especialidadId: especialidadId || undefined,
            });
            setDentistas(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setErrorRed(err.message);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarDentistas();
    }, [page, debouncedQ, especialidadId]);

    return (
        <div className="page-container">
            {errorRed && (
                <div className="alert-banner alert-error">
                    <span>{errorRed}</span>
                    <button className="btn-icon" onClick={cargarDentistas}>Reintentar</button>
                </div>
            )}

            <div className="page-toolbar">
                <div className="toolbar-filters">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar odontólogo por nombre o cédula..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <select
                        className="filter-select"
                        value={especialidadId}
                        onChange={(e) => {
                            setEspecialidadId(e.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="">Todas las especialidades</option>
                        {especialidades.map((esp) => (
                            <option key={esp.id} value={esp.id}>
                                {esp.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="table-card">
                {cargando ? (
                    <div className="state-box">
                        <div className="spinner"></div>
                        <p>Cargando directorio de odontólogos...</p>
                    </div>
                ) : dentistas.length === 0 ? (
                    <div className="state-box">
                        <p>No se encontraron odontólogos con los criterios de búsqueda.</p>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Odontólogo</th>
                                        <th>Especialidad</th>
                                        <th>Cédula Profesional</th>
                                        <th>Correo Electrónico</th>
                                        <th>Teléfono</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dentistas.map((d) => (
                                        <tr key={d.id}>
                                            <td><strong>{d.nombre}</strong></td>
                                            <td>
                                                {d.especialidad || "Odontología General"}
                                            </td>
                                            <td>{d.cedula || "N/A"}</td>
                                            <td>{d.email}</td>
                                            <td>{d.telefono || "No registrado"}</td>
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
        </div>
    );
}