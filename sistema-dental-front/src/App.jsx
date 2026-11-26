import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import CitasPage from "./pages/CitasPage";
import TratamientosPage from "./pages/TratamientosPage";
import DentistasPage from "./pages/DentistasPage";
import PacientesPage from "./pages/PacientesPage";
import MiPerfilPage from "./pages/MiPerfilPage";
import UsuariosAdminPage from "./pages/UsuariosAdminPage";

function PublicRoute({ children }) {
    const { usuario } = useAuth();
    if (usuario) return <Navigate to="/citas" replace />;
    return children;
}

function AppLayout() {
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar isOpen={menuAbierto} onClose={() => setMenuAbierto(false)} />
            <div className="main-area">
                <Navbar onToggleMenu={() => setMenuAbierto((prev) => !prev)} />
                <main className="contenido">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                    <Route path="/registro" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                    <Route path="/olvide-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
                    <Route path="/restablecer-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

                    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                        <Route path="/citas" element={<CitasPage />} />
                        <Route path="/tratamientos" element={<TratamientosPage />} />
                        <Route path="/dentistas" element={<DentistasPage />} />

                        <Route
                            path="/pacientes"
                            element={
                                <ProtectedRoute allowedRoles={["ADMIN", "DENTISTA"]}>
                                    <PacientesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/mi-perfil"
                            element={
                                <ProtectedRoute allowedRoles={["PACIENTE"]}>
                                    <MiPerfilPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/usuarios"
                            element={
                                <ProtectedRoute allowedRoles={["ADMIN"]}>
                                    <UsuariosAdminPage />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    <Route path="*" element={<Navigate to="/citas" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}