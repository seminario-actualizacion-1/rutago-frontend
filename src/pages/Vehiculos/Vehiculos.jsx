import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import MapaSelector from "../../components/MapaSelector/MapaSelector";
import { vehiculosService } from "../../services/vehiculos.service";
import { perfilEntidadService } from "../../services/perfilEntidad.service";
import { usePaginacion } from "../../hooks/usePaginacion";
import { useEstadosVehiculo } from "../../hooks/useEstadosVehiculo";
import { useRoles } from "../../hooks/useRoles";
import "./Vehiculos.css";

function getInitialUser() {
  try {
    const stored = localStorage.getItem("rutago_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function Vehiculos() {
  const user = getInitialUser();
  const { opciones: opcionesEstadosVehiculo, nombre: nombreEstadoVehiculo } =
    useEstadosVehiculo();
  const { obtenerId: obtenerIdRol, loading: loadingRoles } = useRoles();
  const esAdmin = user?.rol?.nombreRol === "Administrador";
  const [vehiculos, setVehiculos] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState(null);
  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    modelo: "",
    color: "",
    capacidadPasajeros: "",
    entidadId: "",
    estadoId: 1,
    latitud: "",
    longitud: "",
  });

  const {
    currentPage,
    itemsPerPage,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    actualizarPaginacion,
    queryParams,
  } = usePaginacion();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ estadoId: "" });
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      const promises = [
        vehiculosService.getAll({
          ...queryParams,
          q: searchTerm || undefined,
          estadoId: filters.estadoId || undefined,
          sortBy,
          sortOrder,
        }),
      ];
      if (esAdmin) {
        promises.push(
          perfilEntidadService.getAll({
            paginaActual: 1,
            registrosPorPagina: 100,
          }),
        );
      }
      const [vehiculosData, entidadesData] = await Promise.all(promises);

      setVehiculos(vehiculosData.data || []);
      actualizarPaginacion(vehiculosData.paginacion);
      if (esAdmin) {
        setEntidades(entidadesData.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, [queryParams, searchTerm, filters, sortBy, sortOrder]);

  const handleNuevoVehiculo = async () => {
    setEditingVehiculo(null);
    const baseForm = {
      placa: "",
      marca: "",
      modelo: "",
      color: "",
      capacidadPasajeros: "",
      entidadId: "",
      estadoId: 1,
      latitud: "",
      longitud: "",
    };
    if (!esAdmin) {
      try {
        const resp = await perfilEntidadService.getMiPerfil();
        const perfil = resp.data || resp;
        baseForm.entidadId = perfil.id;
      } catch {
        // si no tiene perfil de entidad, entidadId queda vacío
      }
    }
    setFormData(baseForm);
    setModalOpen(true);
  };

  const handleEditar = (vehiculo) => {
    setError("");
    setEditingVehiculo(vehiculo);
    setFormData({
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      color: vehiculo.color,
      capacidadPasajeros: vehiculo.capacidadPasajeros,
      entidadId: vehiculo.entidad?.id,
      estadoId: vehiculo.estado?.id,
      latitud: vehiculo.latitud || "",
      longitud: vehiculo.longitud || "",
    });
    setModalOpen(true);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const estadoOptions = opcionesEstadosVehiculo();

  const handleGuardar = async () => {
    try {
      if (editingVehiculo) {
        await vehiculosService.update(editingVehiculo.id, formData);
      } else {
        await vehiculosService.create(formData);
      }
      await fetchVehiculos();
      setModalOpen(false);
      setEditingVehiculo(null);
      setFormData({
        placa: "",
        marca: "",
        modelo: "",
        color: "",
        capacidadPasajeros: "",
        entidadId: "",
        estadoId: 1,
        latitud: "",
        longitud: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarModal = () => {
    setError("");
    setModalOpen(false);
    setEditingVehiculo(null);
    setFormData({
      placa: "",
      marca: "",
      modelo: "",
      color: "",
      capacidadPasajeros: "",
      entidadId: "",
      estadoId: 1,
      latitud: "",
      longitud: "",
    });
  };

  const handleEliminar = async (id) => {
    if (
      !window.confirm("¿Estás seguro de que deseas eliminar este vehículo?")
    ) {
      return;
    }

    try {
      await vehiculosService.delete(id);
      await fetchVehiculos();
    } catch (err) {
      setError(err.message);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      1: "badge-en-terminal",
      2: "badge-en-ruta",
      3: "badge-proximo",
    };
    return colors[estado?.id] || "badge-default";
  };

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "placa", label: "Placa" },
    { value: "marca", label: "Marca" },
    { value: "modelo", label: "Modelo" },
  ];

  const vehiculosPaginados = vehiculos;

  if (loadingRoles)
    return (
      <div className="vehiculos-container">
        <p style={{ textAlign: "center", padding: "2rem" }}>Cargando...</p>
      </div>
    );

  return (
    <div className="vehiculos-container">
      <div className="page-header">
        <h1>Gestión de Vehículos</h1>
      </div>
      {error && !modalOpen && <p className="error">{error}</p>}

      <div className="table-container">
        <div className="table-actions" style={{ marginBottom: "1rem" }}>
          <button
            onClick={handleNuevoVehiculo}
            className="button button-primary"
          >
            + Nuevo Vehículo
          </button>
        </div>

        <TableToolbar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          placeholder="Buscar por placa, marca, modelo o color..."
          filters={[
            {
              name: "estadoId",
              label: "Todos los estados",
              value: filters.estadoId,
              options: estadoOptions,
            },
          ]}
          onFilterChange={handleFilterChange}
          sortOptions={sortOptions}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando vehículos...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="desktop-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Placa</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>Color</th>
                      <th>Capacidad</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiculosPaginados.length > 0 ? (
                      vehiculosPaginados.map((vehiculo) => (
                        <tr key={vehiculo.id}>
                          <td>{vehiculo.id}</td>
                          <td>
                            <span className="font-medium">
                              {vehiculo.placa}
                            </span>
                          </td>
                          <td>{vehiculo.marca}</td>
                          <td>{vehiculo.modelo}</td>
                          <td>{vehiculo.color}</td>
                          <td>{vehiculo.capacidadPasajeros}</td>
                          <td>
                            <span
                              className={`badge ${getEstadoColor(vehiculo.estado)}`}
                            >
                              {vehiculo.estado?.nombre ||
                                nombreEstadoVehiculo(vehiculo.estado?.id) ||
                                vehiculo.estado?.id}
                            </span>
                          </td>
                          <td>
                            <ActionsMenu
                              onEdit={() => handleEditar(vehiculo)}
                              onDelete={() => handleEliminar(vehiculo.id)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No se encontraron vehículos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="mobile-cards">
                {vehiculosPaginados.length > 0 ? (
                  <div className="mobile-cards-list">
                    {vehiculosPaginados.map((vehiculo) => (
                      <div key={vehiculo.id} className="mobile-card">
                        <div className="mobile-card-header">
                          <div className="mobile-card-info">
                            <h3>{vehiculo.placa}</h3>
                            <p>
                              {vehiculo.marca} {vehiculo.modelo}
                            </p>
                            <p>Color: {vehiculo.color}</p>
                          </div>
                          <span
                            className={`mobile-badge ${getEstadoColor(vehiculo.estado)}`}
                          >
                            {vehiculo.estado?.nombre ||
                              nombreEstadoVehiculo(vehiculo.estado?.id) ||
                              vehiculo.estado?.id}
                          </span>
                        </div>

                        <div className="mobile-card-body">
                          <div className="mobile-card-row">
                            <span>Capacidad</span>
                            <span>{vehiculo.capacidadPasajeros}</span>
                          </div>
                        </div>

                        <div className="mobile-card-actions">
                          <ActionsMenu
                            onEdit={() => handleEditar(vehiculo)}
                            onDelete={() => handleEliminar(vehiculo.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mobile-empty">
                    No hay vehículos disponibles
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination?.totalPaginas || 1}
            totalItems={pagination?.totalRegistros || vehiculos.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={editingVehiculo ? "Editar Vehículo" : "Nuevo Vehículo"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGuardar();
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Placa
            </label>
            <input
              type="text"
              value={formData.placa}
              onChange={(e) =>
                setFormData({ ...formData, placa: e.target.value })
              }
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Marca
            </label>
            <input
              type="text"
              value={formData.marca}
              onChange={(e) =>
                setFormData({ ...formData, marca: e.target.value })
              }
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Modelo
            </label>
            <input
              type="text"
              value={formData.modelo}
              onChange={(e) =>
                setFormData({ ...formData, modelo: e.target.value })
              }
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Color
            </label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Capacidad de Pasajeros
            </label>
            <input
              type="number"
              value={formData.capacidadPasajeros}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  capacidadPasajeros: value === "" ? "" : parseInt(value, 10),
                });
              }}
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          {esAdmin && (
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Entidad
              </label>
              <select
                value={formData.entidadId}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    entidadId: value === "" ? "" : parseInt(value, 10),
                  });
                }}
                className="input"
                style={{ width: "100%" }}
                required
              >
                <option value="">Seleccionar entidad</option>
                {entidades.map((entidad) => (
                  <option key={entidad.id} value={entidad.id}>
                    {entidad.razonSocial}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Estado
            </label>
            <select
              value={formData.estadoId}
              onChange={(e) =>
                setFormData({ ...formData, estadoId: parseInt(e.target.value) })
              }
              className="input"
              style={{ width: "100%" }}
              required
            >
              {opcionesEstadosVehiculo().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Ubicación — haz clic en el mapa
            </label>
            <MapaSelector
              latitud={formData.latitud || null}
              longitud={formData.longitud || null}
              onCoordenadasChange={(lat, lng) =>
                setFormData({ ...formData, latitud: lat, longitud: lng })
              }
            />
          </div>
          <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Latitud
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitud}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    latitud: isNaN(parseFloat(value)) ? "" : parseFloat(value),
                  });
                }}
                className="input"
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Longitud
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitud}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    longitud: isNaN(parseFloat(value)) ? "" : parseFloat(value),
                  });
                }}
                className="input"
                style={{ width: "100%" }}
              />
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={handleCerrarModal}
              className="button button-outline"
            >
              Cancelar
            </button>
            <button type="submit" className="button button-primary">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
