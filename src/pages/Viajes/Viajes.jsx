import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import { viajesService } from "../../services/viajes.service";
import "./Viajes.css";

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

function obtenerNombrePersona(usuario) {
  if (!usuario) return "No asignado";
  return (
    `${usuario.nombres || ""} ${usuario.apellidos || ""}`.trim() ||
    usuario.correo ||
    "No asignado"
  );
}

function obtenerNombreBarrio(barrio) {
  return barrio?.nombre || "No definido";
}

export default function Viajes() {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchViajes = async () => {
    try {
      const data = await viajesService.getAll();
      setViajes(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadViajes = async () => {
      await fetchViajes();
    };

    loadViajes();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(viajes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const viajesPaginados = viajes.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading)
    return (
      <div className="viajes-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando viajes...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="viajes-container">
        <p className="error">{error}</p>
      </div>
    );

  return (
    <div className="viajes-container">
      <div className="page-header">
        <h1>Seguimiento de Recorridos</h1>
      </div>

      <div className="table-container">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Desktop Table */}
          <div className="desktop-table">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estado</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Pasajero</th>
                  <th>Conductor</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {viajesPaginados.length > 0 ? (
                  viajesPaginados.map((viaje) => (
                    <tr key={viaje.id}>
                      <td>{viaje.id}</td>
                      <td>
                        <span
                          className={`badge ${obtenerEstadoColor(viaje.estado)}`}
                        >
                          {viaje.estado || "-"}
                        </span>
                      </td>
                      <td>{obtenerNombreBarrio(viaje.barrioOrigen)}</td>
                      <td>{obtenerNombreBarrio(viaje.barrioDestino)}</td>
                      <td>{obtenerNombrePersona(viaje.pasajero)}</td>
                      <td>{obtenerNombrePersona(viaje.conductor)}</td>
                      <td>${viaje.precioEstimado || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No se encontraron recorridos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {viajesPaginados.length > 0 ? (
              <div className="mobile-cards-list">
                {viajesPaginados.map((viaje) => (
                  <div key={viaje.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-info">
                        <h3>Recorrido #{viaje.id}</h3>
                      </div>
                      <span
                        className={`mobile-badge ${obtenerEstadoColor(viaje.estado)}`}
                      >
                        {(viaje.estado || "-").toUpperCase()}
                      </span>
                    </div>

                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <span>Origen</span>
                        <span>{obtenerNombreBarrio(viaje.barrioOrigen)}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span>Destino</span>
                        <span>{obtenerNombreBarrio(viaje.barrioDestino)}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span>Pasajero</span>
                        <span>{obtenerNombrePersona(viaje.pasajero)}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span>Conductor</span>
                        <span>{obtenerNombrePersona(viaje.conductor)}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span>Precio</span>
                        <span>${viaje.precioEstimado || "-"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mobile-empty">No hay recorridos disponibles</div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={viajes.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
}
