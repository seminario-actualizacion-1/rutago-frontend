import { useState, useEffect, useMemo } from "react";
import { useEstadosViaje } from "../../hooks/useEstadosViaje";
import Pagination from "../../components/Pagination/Pagination";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import Modal from "../../components/Modal/Modal";
import MapaRutas from "../../components/MapaRutas/MapaRutas";
import { viajesService } from "../../services/viajes.service";
import { rutasService } from "../../services/rutas.service";
import { horariosService } from "../../services/horarios.service";

import {
  obtenerEstadoId,
  obtenerEstadoColor,
  obtenerNombrePersona,
  textoCupos,
} from "./viajesHelpers";
import { formatearHora } from "../../utils/formato";

export default function ViajesAdmin({ onVerDetalle, onEditar, recargar }) {
  const { opciones, nombre } = useEstadosViaje();
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
  const [modalOpen, setModalOpen] = useState(false);
  const [rutas, setRutas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [crearForm, setCrearForm] = useState({ rutaId: "", horarioId: "", precioEstimado: "" });
  const [crearError, setCrearError] = useState("");
  const [crearLoading, setCrearLoading] = useState(false);

  const queryParams = useMemo(
    () => ({
      paginaActual: currentPage,
      registrosPorPagina: itemsPerPage,
      q: searchTerm || undefined,
      ...(filters.estadoId && { estadoId: filters.estadoId }),
      sortBy,
      sortOrder,
    }),
    [currentPage, itemsPerPage, searchTerm, filters, sortBy, sortOrder],
  );

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

  useEffect(() => {
    loadViajes();
  }, [queryParams, recargar]);

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
  const handleItemsPerPageChange = (n) => {
    setItemsPerPage(n);
    setCurrentPage(1);
  };

  const fetchRutas = async () => {
    try {
      const data = await rutasService.getAll({ paginaActual: 1, registrosPorPagina: 100 });
      setRutas(data.data || []);
    } catch {
      // silencioso
    }
  };

  useEffect(() => {
    fetchRutas();
  }, []);

  const handleRutaChange = async (rutaId) => {
    setCrearForm((prev) => ({ ...prev, rutaId, horarioId: "" }));
    setHorarios([]);
    if (!rutaId) return;
    try {
      const data = await horariosService.getByRuta(rutaId);
      setHorarios(data.data || []);
    } catch {
      setHorarios([]);
    }
  };

  const handleNuevoViaje = () => {
    setCrearForm({ rutaId: "", horarioId: "", precioEstimado: "" });
    setHorarios([]);
    setCrearError("");
    setModalOpen(true);
  };

  const handleGuardarViaje = async (e) => {
    e.preventDefault();
    if (!crearForm.rutaId) {
      setCrearError("Debe seleccionar una ruta");
      return;
    }
    setCrearLoading(true);
    setCrearError("");
    try {
      await viajesService.create({
        rutaId: crearForm.rutaId,
        horarioId: crearForm.horarioId,
        precioEstimado: crearForm.precioEstimado || undefined,
      });
      setModalOpen(false);
      loadViajes();
    } catch (err) {
      setCrearError(err.message);
    } finally {
      setCrearLoading(false);
    }
  };

  const handleEliminar = async (viajeId) => {
    if (!window.confirm("¿Estás seguro de eliminar este viaje?")) return;
    try {
      await viajesService.eliminar(viajeId);
      setViajes((prev) => prev.filter((v) => v.id !== viajeId));
    } catch (err) {
      setError(err.message);
    }
  };

  const rutasUnicas = useMemo(() => {
    const visto = new Set();
    return viajes
      .map((v) => v.ruta)
      .filter((r) => {
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
        <button onClick={handleNuevoViaje} className="button button-primary">
          + Nuevo Viaje
        </button>
        <button
          onClick={() => setVistaMapa(!vistaMapa)}
          className="button button-outline"
        >
          {vistaMapa ? "Ver Tabla" : "Ver Mapa"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {vistaMapa ? (
        <div
          className="bg-white rounded-lg shadow-sm"
          style={{ padding: "1rem" }}
        >
          <h3 style={{ marginBottom: "0.75rem" }}>
            Mapa de Rutas — Buenaventura
          </h3>
          <MapaRutas rutas={rutasUnicas} showSearch />
        </div>
      ) : (
        <div className="table-container">
          <TableToolbar
            searchValue={searchTerm}
            onSearchChange={handleSearchChange}
            placeholder="Buscar por ruta..."
            filters={[
              {
                name: "estadoId",
                label: "Todos los estados",
                value: filters.estadoId,
                options: opciones(),
              },
            ]}
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
                        <th>ID</th>
                        <th>Estado</th>
                        <th>Cupos</th>
                        <th>Ruta</th>
                        <th>Horario</th>
                        <th>Precio</th>
                        <th>Conductor</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viajes.length > 0 ? (
                        viajes.map((viaje) => (
                          <tr key={viaje.id}>
                            <td>{viaje.id}</td>
                            <td>
                              <span
                                className={`badge ${obtenerEstadoColor(obtenerEstadoId(viaje))}`}
                              >
                                {viaje.estado?.nombre ||
                                  nombre(obtenerEstadoId(viaje)) ||
                                  obtenerEstadoId(viaje) ||
                                  "-"}
                              </span>
                            </td>
                            <td>{textoCupos(viaje)}</td>
                            <td>
                              <span className="font-medium">
                                {viaje.ruta?.nombre || "-"}
                              </span>
                            </td>
                            <td>
                              {formatearHora(viaje.horario?.horaSalida) || "-"}
                            </td>
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
                          <td colSpan={8} className="text-center">
                            No se encontraron recorridos registrados
                          </td>
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
                              <p>
                                Horario:{" "}
                                {formatearHora(viaje.horario?.horaSalida) || "-"}
                              </p>
                            </div>
                            <span
                              className={`mobile-badge ${obtenerEstadoColor(obtenerEstadoId(viaje))}`}
                            >
                              {(
                                viaje.estado?.nombre ||
                                nombreEstadoViaje(obtenerEstadoId(viaje)) ||
                                obtenerEstadoId(viaje) ||
                                "-"
                              ).toString()}
                            </span>
                          </div>
                          <div className="mobile-card-body">
                            <div className="mobile-card-row">
                              <span>Cupos</span>
                              <span>{textoCupos(viaje)}</span>
                            </div>
                            <div className="mobile-card-row">
                              <span>Precio</span>
                              <span>${viaje.precioEstimado || "-"}</span>
                            </div>
                            <div className="mobile-card-row">
                              <span>Conductor</span>
                              <span>
                                {obtenerNombrePersona(viaje.conductor)}
                              </span>
                            </div>
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
                    <div className="mobile-empty">
                      No hay recorridos disponibles
                    </div>
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
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo Viaje"
      >
        <form onSubmit={handleGuardarViaje}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Ruta
            </label>
            <select
              value={crearForm.rutaId}
              onChange={(e) => handleRutaChange(e.target.value)}
              className="input"
              style={{ width: "100%" }}
              required
            >
              <option value="">Seleccionar ruta</option>
              {rutas.map((ruta) => (
                <option key={ruta.id} value={ruta.id}>
                  {ruta.nombre}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Horario
            </label>
            <select
              value={crearForm.horarioId}
              onChange={(e) => setCrearForm({ ...crearForm, horarioId: e.target.value })}
              className="input"
              style={{ width: "100%" }}
              required
            >
              <option value="">Seleccionar horario</option>
              {horarios.map((h) => (
                <option key={h.id} value={h.id}>
                  {formatearHora(h.horaSalida) || h.id}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Precio estimado ($)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={crearForm.precioEstimado}
              onChange={(e) => setCrearForm({ ...crearForm, precioEstimado: e.target.value })}
              className="input"
              style={{ width: "100%" }}
              placeholder="Opcional"
            />
          </div>
          {crearError && <p className="error">{crearError}</p>}
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="button button-outline"
            >
              Cancelar
            </button>
            <button type="submit" className="button button-primary" disabled={crearLoading}>
              {crearLoading ? "Creando..." : "Crear Viaje"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
