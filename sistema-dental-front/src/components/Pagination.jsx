export default function Pagination({ page, totalPages, totalElements, size, onPageChange }) {
    if (totalPages <= 1 && totalElements === 0) return null;

    const inicio = totalElements === 0 ? 0 : page * size + 1;
    const fin = Math.min((page + 1) * size, totalElements);

    // Genera un rango corto de páginas visibles
    const paginas = [];
    const maxVisibles = 5;
    let start = Math.max(0, page - Math.floor(maxVisibles / 2));
    let end = Math.min(totalPages - 1, start + maxVisibles - 1);
    if (end - start + 1 < maxVisibles) {
        start = Math.max(0, end - maxVisibles + 1);
    }
    for (let i = start; i <= end; i++) {
        paginas.push(i);
    }

    return (
        <div className="pagination-bar">
            <span>
                Mostrando <strong>{inicio}</strong> a <strong>{fin}</strong> de{" "}
                <strong>{totalElements}</strong> registros
            </span>

            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        type="button"
                        className="page-btn"
                        disabled={page === 0}
                        onClick={() => onPageChange(page - 1)}
                    >
                        Anterior
                    </button>

                    {paginas.map((num) => (
                        <button
                            key={num}
                            type="button"
                            className={`page-btn ${num === page ? "active" : ""}`}
                            onClick={() => onPageChange(num)}
                        >
                            {num + 1}
                        </button>
                    ))}

                    <button
                        type="button"
                        className="page-btn"
                        disabled={page >= totalPages - 1}
                        onClick={() => onPageChange(page + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}