import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import { viajesService } from "../../services/viajes.service";
import { ESTADOS_VIAJE } from "../../config/estados";
import "./Viajes.css";

function obtenerEstadoColor(estadoId) {
  const colors = {
    1: "badge-pendiente",
    2: "badge-aceptado",
    3: "badge-en-curso",
    4: "badge-finalizado",
    5: "badge-cancelado",
  };
  return colors[estadoId] || "badge-default";
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

function getInitialUser() {
  try {
    const stored = localStorage.getItem("rutago_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function Viajes() {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    paginaActual: 1,
    registrosPorPagina: 10,
    totalPaginas: 1,
    totalRegistros: 0,
    tienePaginaAnterior: false,
    tienePaginaSiguiente: false,
  });

  const user = getInitialUser();
  const esAdmin = user?.rolId === 1;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ estadoId: "" });
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");

  useEffect(() => {
    const loadViajes = async () => {
      try {
        setLoading(true);
        if (esAdmin) {
          const data = await viajesService.getAll({
            paginaActual: currentPage,
            registrosPorPagina: itemsPerPage,
            q: searchTerm || undefined,
            ...(filters.estadoId && { estadoId: filters.estadoId }),
            sortBy,
            sortOrder,
          });
          setViajes(data.data || []);
          setPagination(
            data.paginacion || {
              paginaActual: currentPage,
              registrosPorPagina: itemsPerPage,
              totalPaginas: 1,
              totalRegistros: data.data?.length || 0,
              tienePaginaAnterior: false,
              tienePaginaSiguiente: false,
            },
          );
        } else {
          const data = await viajesService.getMisViajes();
          setViajes(data.data || []);
          setPagination({
            paginaActual: 1,
            registrosPorPagina: (data.data || []).length,
            totalPaginas: 1,
            totalRegistros: (data.data || []).length,
            tienePaginaAnterior: false,
            tienePaginaSiguiente: false,
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadViajes();
  }, [currentPage, itemsPerPage, searchTerm, filters, sortBy, sortOrder, esAdmin]);

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

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "estado", label: "Estado" },
  ];

  const viajesPaginados = viajes;

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

  return (
    <div className="viajes-container">
      <div className="page-header">
        <h1>Seguimiento de Recorridos</h1>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="table-container">

      {esAdmin && (
        <TableToolbar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          placeholder="Buscar por pasajero, conductor o barrios..."
          filters={[
            {
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
            },
          ]}
          onFilterChange={handleFilterChange}
          sortOptions={sortOptions}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      )}

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
                          className={`badge ${obtenerEstadoColor(viaje.estadoId)}`}
                        >
                          {ESTADOS_VIAJE[viaje.estadoId] || viaje.estadoId || "-"}
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
                    <td colSpan="7" className="text-center">
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
                        className={`mobile-badge ${obtenerEstadoColor(viaje.estadoId)}`}
                      >
                        {(ESTADOS_VIAJE[viaje.estadoId] || viaje.estadoId || "-").toString()}
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

        {esAdmin && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPaginas || 1}
            totalItems={pagination.totalRegistros || viajes.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>
    </div>
  );
}
