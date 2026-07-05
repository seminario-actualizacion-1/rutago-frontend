import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import { vehiculosService } from "../../services/vehiculos.service";
import { perfilEntidadService } from "../../services/perfilEntidad.service";
import { ESTADOS_VEHICULO } from "../../config/estados";
import "./Vehiculos.css";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    paginaActual: 1,
    registrosPorPagina: 10,
    totalPaginas: 1,
    totalRegistros: 0,
    tienePaginaAnterior: false,
    tienePaginaSiguiente: false,
  });
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

  // Pagination & search state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ estadoId: "" });
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [vehiculosData, entidadesData] = await Promise.all([
          vehiculosService.getAll({
            paginaActual: currentPage,
            registrosPorPagina: itemsPerPage,
            q: searchTerm || undefined,
            estadoId: filters.estadoId || undefined,
            sortBy,
            sortOrder,
          }),
          perfilEntidadService.getAll({
            paginaActual: 1,
            registrosPorPagina: 100,
          }),
        ]);

        setVehiculos(vehiculosData.data || []);
        setPagination(
          vehiculosData.paginacion || {
            paginaActual: currentPage,
            registrosPorPagina: itemsPerPage,
            totalPaginas: 1,
            totalRegistros: vehiculosData.data?.length || 0,
            tienePaginaAnterior: false,
            tienePaginaSiguiente: false,
          },
        );
        setEntidades(entidadesData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, itemsPerPage, searchTerm, filters, sortBy, sortOrder]);

  const handleEditar = (vehiculo) => {
    setError("");
    setEditingVehiculo(vehiculo);
    setFormData({
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      color: vehiculo.color,
      capacidadPasajeros: vehiculo.capacidadPasajeros,
      entidadId: vehiculo.entidadId,
      estadoId: vehiculo.estadoId,
      latitud: vehiculo.latitud || "",
      longitud: vehiculo.longitud || "",
    });
    setModalOpen(true);
  };

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

  const estadoOptions = [
    { value: 1, label: "En Terminal" },
    { value: 2, label: "En Ruta" },
    { value: 3, label: "Próximo" },
  ];

  const handleGuardar = async () => {
    try {
      if (editingVehiculo) {
        await vehiculosService.update(editingVehiculo.id, formData);
      } else {
        await vehiculosService.create(formData);
      }
      setCurrentPage(1);
      const data = await vehiculosService.getAll({
        paginaActual: 1,
        registrosPorPagina: itemsPerPage,
      });
      setVehiculos(data.data || []);
      setPagination(
        data.paginacion || {
          paginaActual: 1,
          registrosPorPagina: itemsPerPage,
          totalPaginas: 1,
          totalRegistros: data.data?.length || 0,
          tienePaginaAnterior: false,
          tienePaginaSiguiente: false,
        },
      );
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
      setCurrentPage(1);
      const data = await vehiculosService.getAll({
        paginaActual: 1,
        registrosPorPagina: itemsPerPage,
      });
      setVehiculos(data.data || []);
      setPagination(
        data.paginacion || {
          paginaActual: 1,
          registrosPorPagina: itemsPerPage,
          totalPaginas: 1,
          totalRegistros: data.data?.length || 0,
          tienePaginaAnterior: false,
          tienePaginaSiguiente: false,
        },
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const getEstadoColor = (estadoId) => {
    const colors = {
      1: "badge-en-terminal",
      2: "badge-en-ruta",
      3: "badge-proximo",
    };
    return colors[estadoId] || "badge-default";
  };

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "placa", label: "Placa" },
    { value: "marca", label: "Marca" },
    { value: "modelo", label: "Modelo" },
  ];

  const vehiculosPaginados = vehiculos;

  if (loading)
    return (
      <div className="vehiculos-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando vehículos...</p>
        </div>
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
            onClick={() => {
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
              setModalOpen(true);
            }}
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
                        <span className="font-medium">{vehiculo.placa}</span>
                      </td>
                      <td>{vehiculo.marca}</td>
                      <td>{vehiculo.modelo}</td>
                      <td>{vehiculo.color}</td>
                      <td>{vehiculo.capacidadPasajeros}</td>
                      <td>
                        <span
                          className={`badge ${getEstadoColor(vehiculo.estadoId)}`}
                        >
                          {ESTADOS_VEHICULO[vehiculo.estadoId] || vehiculo.estadoId}
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
                        className={`mobile-badge ${getEstadoColor(vehiculo.estadoId)}`}
                      >
                        {ESTADOS_VEHICULO[vehiculo.estadoId] || vehiculo.estadoId}
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
              <div className="mobile-empty">No hay vehículos disponibles</div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPaginas || 1}
          totalItems={pagination.totalRegistros || vehiculos.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(n) => {
            setItemsPerPage(n);
            setCurrentPage(1);
          }}
        />
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
              <option value="1">En Terminal</option>
              <option value="2">En Ruta</option>
              <option value="3">Próximo</option>
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
              Latitud (opcional)
            </label>
            <input
              type="number"
              step="any"
              value={formData.latitud}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  latitud: value === "" ? "" : parseFloat(value),
                });
              }}
              className="input"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Longitud (opcional)
            </label>
            <input
              type="number"
              step="any"
              value={formData.longitud}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  longitud: value === "" ? "" : parseFloat(value),
                });
              }}
              className="input"
              style={{ width: "100%" }}
            />
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
