import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Registro from "./pages/Registro/Registro";
import RecuperarPassword from "./pages/RecuperarPassword/RecuperarPassword";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import { LayoutProvider } from "./context/LayoutContext";
import Dashboard from "./pages/Dashboard/Dashboard";
import Pasajeros from "./pages/Pasajeros/Pasajeros";
import Conductores from "./pages/Conductores/Conductores";
import Vehiculos from "./pages/Vehiculos/Vehiculos";
import Barrios from "./pages/Barrios/Barrios";
import Comunas from "./pages/Comunas/Comunas";
import Rutas from "./pages/Rutas/Rutas";
import Horarios from "./pages/Horarios/Horarios";
import Entidades from "./pages/Entidades/Entidades";
import Perfil from "./pages/Perfil/Perfil";
import Viajes from "./pages/Viajes/Viajes";
import Usuarios from "./pages/Usuarios/Usuarios";
import { usuariosService } from "./services/usuarios.service";
import { ROLES } from "./config/roles";
import "./index.css";

function getInitialUser() {
  try {
    const stored = localStorage.getItem("rutago_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(getInitialUser);
  const [verificandoToken, setVerificandoToken] = useState(true);

  useEffect(() => {
    const handleStorage = () => setUser(getInitialUser());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const verificarSesion = async () => {
      const token = localStorage.getItem("token");
      const user = getInitialUser();

      if (!token || !user) {
        setVerificandoToken(false);
        return;
      }

      try {
        const response = await usuariosService.verificarToken();

        if (response.success && response.usuario) {
          const userActualizado = {
            ...user,
            token,
            usuario: response.usuario,
          };
          localStorage.setItem("rutago_user", JSON.stringify(userActualizado));
          setUser(userActualizado);
        }
      } catch (error) {
        console.error("Token inválido o expirado:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("rutago_user");
        setUser(null);
      } finally {
        setVerificandoToken(false);
      }
    };

    verificarSesion();
  }, []);

  const isLoggedIn = !!localStorage.getItem("token");

  if (verificandoToken) {
    return (
      <div className="app">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="spinner"></div>
          <p>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <LayoutProvider>
        <div className="app">
          <Navbar />
          <div className="app-body">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
                }
              />
              <Route
                path="/registro"
                element={
                  isLoggedIn ? <Navigate to="/dashboard" replace /> : <Registro />
                }
              />
              <Route path="/recuperar-password" element={<RecuperarPassword />} />
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/usuarios"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <Usuarios />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pasajeros"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <Pasajeros />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/conductores"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <Conductores />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vehiculos"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ENTIDAD]}>
                      <Vehiculos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/barrios"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <Barrios />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/comunas"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <Comunas />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/rutas"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <Rutas />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/horarios"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <Horarios />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/entidades"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <Entidades />
                    </ProtectedRoute>
                  }
                />
                <Route path="/perfil" element={<Perfil />} />
                <Route
                  path="/viajes"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.CONDUCTOR, ROLES.PASAJERO]}>
                      <Viajes />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </div>
          {!isLoggedIn && <Footer />}
        </div>
      </LayoutProvider>
    </BrowserRouter>
  );
}
