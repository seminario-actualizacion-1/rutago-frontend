import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROLES, obtenerRol } from "../../config/roles";
import { usuariosService } from "../../services/usuarios.service";
import { conductoresService } from "../../services/conductores.service";
import { perfilPasajeroService } from "../../services/perfilPasajero.service";
import { vehiculosService } from "../../services/vehiculos.service";
import { viajesService } from "../../services/viajes.service";
import { entidadesService } from "../../services/entidades.service";
import { barriosService } from "../../services/barrios.service";
import { comunasService } from "../../services/comunas.service";
import { rutasService } from "../../services/rutas.service";
import { horariosService } from "../../services/horarios.service";
import "./Dashboard.css";

function getInitialUser() {
  try {
    const stored = localStorage.getItem("rutago_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function obtenerEstadoColor(estado) {
  const colors = {
    BUSCANDO: "badge-pendiente",
    ACEPTADO: "badge-aceptado",
    EN_CURSO: "badge-en-curso",
    FINALIZADO: "badge-finalizado",
    CANCELADO: "badge-cancelado",
  };
  return colors[estado] || "badge-default";
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, conductores, pasajeros, vehiculos, viajes, entidades, barrios, comunas, rutas, horarios] =
          await Promise.all([
            usuariosService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            conductoresService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            perfilPasajeroService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            vehiculosService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            viajesService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            entidadesService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            barriosService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            comunasService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            rutasService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            horariosService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
          ]);
        setStats({
          usuarios: users.paginacion?.totalRegistros || users.data?.length || 0,
          conductores: conductores.paginacion?.totalRegistros || conductores.data?.length || 0,
          pasajeros: pasajeros.paginacion?.totalRegistros || pasajeros.data?.length || 0,
          vehiculos: vehiculos.paginacion?.totalRegistros || vehiculos.data?.length || 0,
          viajes: viajes.paginacion?.totalRegistros || viajes.data?.length || 0,
          entidades: entidades.paginacion?.totalRegistros || entidades.data?.length || 0,
          barrios: barrios.paginacion?.totalRegistros || barrios.data?.length || 0,
          comunas: comunas.paginacion?.totalRegistros || comunas.data?.length || 0,
          rutas: rutas.paginacion?.totalRegistros || rutas.data?.length || 0,
          horarios: horarios.paginacion?.totalRegistros || horarios.data?.length || 0,
        });
      } catch {
        // stats stay null
      }
    };
    fetchStats();
  }, []);

  const modulos = [
    { nombre: "Usuarios", ruta: "/usuarios", cantidad: stats?.usuarios },
    { nombre: "Conductores", ruta: "/conductores", cantidad: stats?.conductores },
    { nombre: "Pasajeros", ruta: "/pasajeros", cantidad: stats?.pasajeros },
    { nombre: "Vehículos", ruta: "/vehiculos", cantidad: stats?.vehiculos },
    { nombre: "Barrios", ruta: "/barrios", cantidad: stats?.barrios },
    { nombre: "Comunas", ruta: "/comunas", cantidad: stats?.comunas },
    { nombre: "Rutas", ruta: "/rutas", cantidad: stats?.rutas },
    { nombre: "Horarios", ruta: "/horarios", cantidad: stats?.horarios },
    { nombre: "Viajes", ruta: "/viajes", cantidad: stats?.viajes },
    { nombre: "Entidades", ruta: "/entidades", cantidad: stats?.entidades },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Panel de Administración</h1>
      </div>

      <div className="dashboard-card">
        <table className="table">
          <thead>
            <tr>
              <th>Módulo</th>
              <th>Registros</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {modulos.map((m) => (
              <tr key={m.nombre}>
                <td><span className="font-medium">{m.nombre}</span></td>
                <td>{m.cantidad ?? "—"}</td>
                <td>
                  <Link to={m.ruta} className="button button-outline" style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem" }}>
                    Gestionar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ConductorDashboard() {
  const [viajeActivo, setViajeActivo] = useState(null);
  const [totalViajes, setTotalViajes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await viajesService.getMisViajes({
          paginaActual: 1,
          registrosPorPagina: 10,
        });
        const lista = data.data || [];
        setTotalViajes(data.paginacion?.totalRegistros || lista.length);
        const activo = lista.find(
          (v) => v.estado === "ACEPTADO" || v.estado === "EN_CURSO",
        );
        setViajeActivo(activo || null);
      } catch {
        // ignore
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Panel de Conductor</h1>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card stat-card-green">
          <span className="stat-number">{totalViajes}</span>
          <span className="stat-label">Viajes totales</span>
        </div>
        <div className="stat-card stat-card-blue">
          <span className="stat-number">{viajeActivo ? 1 : 0}</span>
          <span className="stat-label">Viaje activo</span>
        </div>
      </div>

      {viajeActivo ? (
        <div className="dashboard-card">
          <h2>Viaje en curso</h2>
          <p><strong>Origen:</strong> {viajeActivo.barrioOrigen?.nombre || "—"}</p>
          <p><strong>Destino:</strong> {viajeActivo.barrioDestino?.nombre || "—"}</p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className={`badge ${obtenerEstadoColor(viajeActivo.estado)}`}>
              {viajeActivo.estado}
            </span>
          </p>
          <Link to="/viajes" className="button button-primary" style={{ marginTop: "1rem" }}>
            Ver todos mis viajes
          </Link>
        </div>
      ) : (
        <div className="dashboard-card">
          <h2>Sin viaje activo</h2>
          <p>Actualmente no tienes ningún viaje en curso. Espera a que te asignen uno.</p>
          <Link to="/viajes" className="button button-primary" style={{ marginTop: "1rem" }}>
            Historial de viajes
          </Link>
        </div>
      )}
    </>
  );
}

function PasajeroDashboard() {
  const [ultimosViajes, setUltimosViajes] = useState([]);
  const [totalViajes, setTotalViajes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await viajesService.getMisViajes({
          paginaActual: 1,
          registrosPorPagina: 5,
        });
        const lista = data.data || [];
        setUltimosViajes(lista);
        setTotalViajes(data.paginacion?.totalRegistros || lista.length);
      } catch {
        // ignore
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Panel de Pasajero</h1>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card stat-card-purple">
          <span className="stat-number">{totalViajes}</span>
          <span className="stat-label">Mis viajes</span>
        </div>
      </div>

      <div className="dashboard-section">
        <Link to="/viajes" className="button button-primary" style={{ marginBottom: "1rem" }}>
          Solicitar nuevo viaje
        </Link>
      </div>

      {ultimosViajes.length > 0 && (
        <div className="dashboard-card">
          <h2>Últimos viajes</h2>
          {ultimosViajes.map((v) => (
            <div key={v.id} className="viaje-row">
              <span>
                {v.barrioOrigen?.nombre || "—"} → {v.barrioDestino?.nombre || "—"}
              </span>
              <span className={`badge ${obtenerEstadoColor(v.estado)}`}>{v.estado}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function EntidadDashboard() {
  const [totalVehiculos, setTotalVehiculos] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await vehiculosService.getAll({
          paginaActual: 1,
          registrosPorPagina: 1,
        });
        setTotalVehiculos(data.paginacion?.totalRegistros || data.data?.length || 0);
      } catch {
        // ignore
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Panel de Entidad Externa</h1>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card stat-card-orange">
          <span className="stat-number">{totalVehiculos}</span>
          <span className="stat-label">Vehículos registrados</span>
        </div>
      </div>

      <div className="dashboard-section">
        <Link to="/vehiculos" className="button button-primary">
          Gestionar vehículos
        </Link>
      </div>
    </>
  );
}

export default function Dashboard() {
  const [user] = useState(getInitialUser);

  if (!user) {
    return (
      <div className="dashboard-container">
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando perfil...</p>
      </div>
    );
  }

  const rol = user.rolId;

  return (
    <div className="dashboard-container">
      {rol === ROLES.ADMIN && <AdminDashboard />}
      {rol === ROLES.CONDUCTOR && <ConductorDashboard />}
      {rol === ROLES.PASAJERO && <PasajeroDashboard />}
      {rol === ROLES.ENTIDAD && <EntidadDashboard />}
    </div>
  );
}
