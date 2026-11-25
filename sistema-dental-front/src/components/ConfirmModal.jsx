import Modal from "./Modal";

export default function ConfirmModal({
    isOpen,
    title = "Confirmar acción",
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "danger", // "danger" | "primary"
    loading = false,
    onConfirm,
    onClose,
}) {
    return (
        <Modal isOpen={isOpen} title={title} onClose={loading ? () => {} : onClose}>
            <p style={{ margin: "0 0 8px", color: "#344054", fontSize: "15px", lineHeight: "22px" }}>
                {message}
            </p>
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={onClose}
                    disabled={loading}
                >
                    {cancelText}
                </button>
                <button
                    type="button"
                    className={variant === "danger" ? "btn-danger" : "btn-primary"}
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? "Procesando..." : confirmText}
                </button>
            </div>
        </Modal>
    );
}