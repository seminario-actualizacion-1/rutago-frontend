import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { vehiculosService } from "../../services/vehiculos.service";

export default function EntidadDashboard() {
  const [totalVehiculos, setTotalVehiculos] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await vehiculosService.getAll({
          paginaActual: 1,
          registrosPorPagina: 1,
        });
        setTotalVehiculos(data.paginacion?.totalRegistros || data.data?.length || 0);
      } catch (error) {
        console.error("Error al cargar datos de la entidad:", error);
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
