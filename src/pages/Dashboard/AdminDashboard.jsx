import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usuariosService } from "../../services/usuarios.service";
import { perfilConductorService } from "../../services/perfilConductor.service";
import { perfilPasajeroService } from "../../services/perfilPasajero.service";
import { vehiculosService } from "../../services/vehiculos.service";
import { viajesService } from "../../services/viajes.service";
import { perfilEntidadService } from "../../services/perfilEntidad.service";
import { barriosService } from "../../services/barrios.service";
import { comunasService } from "../../services/comunas.service";
import { rutasService } from "../../services/rutas.service";
import { horariosService } from "../../services/horarios.service";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [users, conductores, pasajeros, vehiculos, viajes, entidades, barrios, comunas, rutas, horarios] =
          await Promise.all([
            usuariosService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            perfilConductorService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            perfilPasajeroService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            vehiculosService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            viajesService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            perfilEntidadService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            barriosService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            comunasService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            rutasService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
            horariosService.getAll({ paginaActual: 1, registrosPorPagina: 1 }),
          ]);
        if (!mounted) return;
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
      } catch (error) {
        if (!mounted) return;
        console.error("Error al cargar estadísticas del dashboard:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
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

  if (loading) {
    return (
      <>
        <div className="page-header"><h1>Panel de Administración</h1></div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </>
    );
  }

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
