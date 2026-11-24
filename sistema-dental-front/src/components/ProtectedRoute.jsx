import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
    const { usuario } = useAuth();

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(usuario.rol)) {
        return <Navigate to="/citas" replace />;
    }

    return children;
}