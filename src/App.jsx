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
import Dashboard from "./pages/Dashboard/Dashboard";
import Pasajeros from "./pages/Pasajeros/Pasajeros";
import Conductores from "./pages/Conductores/Conductores";
import Vehiculos from "./pages/Vehiculos/Vehiculos";
import Barrios from "./pages/Barrios/Barrios";
import Comunas from "./pages/Comunas/Comunas";
import Rutas from "./pages/Rutas/Rutas";
import Entidades from "./pages/Entidades/Entidades";
import Perfil from "./pages/Perfil/Perfil";
import Viajes from "./pages/Viajes/Viajes";
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

  useEffect(() => {
    const handleStorage = () => setUser(getInitialUser());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isLoggedIn = !!user?.token;

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <div className="app-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/registro" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Registro />} />
            <Route path="/recuperar-password" element={<RecuperarPassword />} />
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pasajeros" element={<Pasajeros />} />
              <Route path="/conductores" element={<Conductores />} />
              <Route path="/vehiculos" element={<Vehiculos />} />
              <Route path="/barrios" element={<Barrios />} />
              <Route path="/comunas" element={<Comunas />} />
              <Route path="/rutas" element={<Rutas />} />
              <Route path="/entidades" element={<Entidades />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/viajes" element={<Viajes />} />
            </Route>
          </Routes>
        </div>
        {!isLoggedIn && <Footer />}
      </div>
    </BrowserRouter>
  );
}
