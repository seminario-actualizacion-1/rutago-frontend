import { useState, useEffect, useMemo } from "react";
import Pagination from "../../components/Pagination/Pagination";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import MapaRutas from "../../components/MapaRutas/MapaRutas";
import { viajesService } from "../../services/viajes.service";
import { ESTADOS_VIAJE } from "../../config/estados";
import { obtenerEstadoId, obtenerEstadoColor, obtenerNombrePersona, textoCupos } from "./viajesHelpers";

export default function ViajesAdmin({ onVerDetalle, onEditar }) {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vistaMapa, setVistaMapa] = useState(false);
  const [paginacion, setPaginacion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ estadoId: "" });
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");

  const queryParams = useMemo(() => ({
    paginaActual: currentPage,
    registrosPorPagina: itemsPerPage,
    q: searchTerm || undefined,
    ...(filters.estadoId && { estadoId: filters.estadoId }),
    sortBy,
    sortOrder,
  }), [currentPage, itemsPerPage, searchTerm, filters, sortBy, sortOrder]);

  const loadViajes = async () => {
    try {
      setLoading(true);
      const data = await viajesService.getAll(queryParams);
      setViajes(data.data || []);
      setPaginacion(data.paginacion || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadViajes(); }, [queryParams]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (n) => { setItemsPerPage(n); setCurrentPage(1); };

  const handleEliminar = async (viajeId) => {
    try {
      await viajesService.eliminar(viajeId);
      setViajes((prev) => prev.filter((v) => v.id !== viajeId));
    } catch (err) {
      setError(err.message);
    }
  };

  const rutasUnicas = useMemo(() => {
    const visto = new Set();
    return viajes.map((v) => v.ruta).filter((r) => {
      if (!r || visto.has(r.id)) return false;
      visto.add(r.id);
      return true;
    });
  }, [viajes]);

  return (
    <>
      <div className="page-header">
        <h1>Seguimiento de Recorridos</h1>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button onClick={() => setVistaMapa(!vistaMapa)} className="button button-outline">
          {vistaMapa ? "Ver Tabla" : "Ver Mapa"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {vistaMapa ? (
        <div className="bg-white rounded-lg shadow-sm" style={{ padding: "1rem" }}>
          <h3 style={{ marginBottom: "0.75rem" }}>Mapa de Rutas — Buenaventura</h3>
          <MapaRutas rutas={rutasUnicas} showSearch />
        </div>
      ) : (
        <div className="table-container">
          <TableToolbar
            searchValue={searchTerm}
            onSearchChange={handleSearchChange}
            placeholder="Buscar por ruta..."
            filters={[{
              name: "estadoId",
              label: "Todos los estados",
              value: filters.estadoId,
              options: [
                { value: 1, label: "Buscando" },
                { value: 2, label: "Aceptado" },
                { value: 3, label: "En curso" },
                { value: 4, label: "Finalizado" },
                { value: 5, label: "Cancelado" },
              ],
            }]}
            onFilterChange={handleFilterChange}
            sortOptions={[
              { value: "id", label: "ID" },
              { value: "estado", label: "Estado" },
            ]}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />

          <div className="bg-white rounded-lg shadow-sm">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando viajes...</p>
              </div>
            ) : (
              <>
                <div className="desktop-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th title="Identificador único del viaje">ID</th>
                        <th title="Estado actual del viaje (Buscando, Aceptado, En curso, Finalizado, Cancelado)">Estado</th>
                        <th title="Cupos disponibles y ocupados en el viaje">Cupos</th>
                        <th title="Nombre de la ruta del viaje">Ruta</th>
                        <th title="Hora de salida programada">Horario</th>
                        <th title="Precio estimado del viaje">Precio</th>
                        <th title="Nombre del conductor asignado">Conductor</th>
                        <th title="Opciones disponibles para este registro">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viajes.length > 0 ? (
                        viajes.map((viaje) => (
                          <tr key={viaje.id}>
                            <td>{viaje.id}</td>
                            <td>
                              <span className={`badge ${obtenerEstadoColor(obtenerEstadoId(viaje))}`}>
                                {viaje.estado?.nombre || ESTADOS_VIAJE[obtenerEstadoId(viaje)] || obtenerEstadoId(viaje) || "-"}
                              </span>
                            </td>
                            <td>{textoCupos(viaje)}</td>
                            <td><span className="font-medium">{viaje.ruta?.nombre || "-"}</span></td>
                            <td>{viaje.horario?.horaSalida?.slice(0, 5) || "-"}</td>
                            <td>${viaje.precioEstimado || "-"}</td>
                            <td>{obtenerNombrePersona(viaje.conductor)}</td>
                            <td>
                              <ActionsMenu
                                onView={() => onVerDetalle(viaje)}
                                onEdit={() => onEditar(viaje)}
                                onDelete={() => handleEliminar(viaje.id)}
                                deleteLabel="Eliminar"
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center">No se encontraron recorridos registrados</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mobile-cards">
                  {viajes.length > 0 ? (
                    <div className="mobile-cards-list">
                      {viajes.map((viaje) => (
                        <div key={viaje.id} className="mobile-card">
                          <div className="mobile-card-header">
                            <div className="mobile-card-info">
                              <h3>Viaje #{viaje.id}</h3>
                              <p>{viaje.ruta?.nombre || "-"}</p>
                              <p>Horario: {viaje.horario?.horaSalida?.slice(0, 5) || "-"}</p>
                            </div>
                            <span className={`mobile-badge ${obtenerEstadoColor(obtenerEstadoId(viaje))}`}>
                              {(viaje.estado?.nombre || ESTADOS_VIAJE[obtenerEstadoId(viaje)] || obtenerEstadoId(viaje) || "-").toString()}
                            </span>
                          </div>
                          <div className="mobile-card-body">
                            <div className="mobile-card-row"><span>Cupos</span><span>{textoCupos(viaje)}</span></div>
                            <div className="mobile-card-row"><span>Precio</span><span>${viaje.precioEstimado || "-"}</span></div>
                            <div className="mobile-card-row"><span>Conductor</span><span>{obtenerNombrePersona(viaje.conductor)}</span></div>
                          </div>
                          <div className="mobile-card-actions">
                            <ActionsMenu
                              onView={() => onVerDetalle(viaje)}
                              onEdit={() => onEditar(viaje)}
                              onDelete={() => handleEliminar(viaje.id)}
                              deleteLabel="Eliminar"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mobile-empty">No hay recorridos disponibles</div>
                  )}
                </div>
              </>
            )}
          </div>

          {!loading && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginacion?.totalPaginas || 1}
              totalItems={paginacion?.totalRegistros || viajes.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      )}
    </>
  );
}
