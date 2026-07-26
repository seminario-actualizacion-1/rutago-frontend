import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import { horariosService } from "../../services/horarios.service";
import { rutasService } from "../../services/rutas.service";
import { vehiculosService } from "../../services/vehiculos.service";
import { usePaginacion } from "../../hooks/usePaginacion";

const minutosATime = (min) => {
  if (!min && min !== 0) return "";
  const h = Math.floor(min / 60).toString().padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

const timeAMinutos = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  return parseInt(h) * 60 + parseInt(m);
};

const emptyForm = {
  vehiculoId: "",
  rutaId: "",
  horaSalida: "",
  frecuenciaMinutos: "",
  fechaInicio: "",
  fechaFin: "",
};

export default function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

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
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");

  const fetchHorarios = async () => {
    try {
      setLoading(true);
      const data = await horariosService.getAll({
        ...queryParams,
        q: searchTerm || undefined,
        sortBy,
        sortOrder,
      });
      setHorarios(data.data || []);
      actualizarPaginacion(data.paginacion);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [rutasData, vehiculosData] = await Promise.all([
          rutasService.getAll({
            paginaActual: 1,
            registrosPorPagina: 100,
          }),
          vehiculosService.getAll({
            paginaActual: 1,
            registrosPorPagina: 100,
          }),
        ]);
        setRutas(rutasData.data || []);
        setVehiculos(vehiculosData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    fetchHorarios();
  }, [queryParams, searchTerm, sortBy, sortOrder]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleNuevo = () => {
    setEditingHorario(null);
    setFormData(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const handleEditar = (horario) => {
    setEditingHorario(horario);
    setFormData({
      vehiculoId: horario.vehiculo?.id || "",
      rutaId: horario.ruta?.id || "",
      horaSalida: horario.horaSalida
        ? String(horario.horaSalida).slice(0, 5)
        : "",
      frecuenciaMinutos: minutosATime(horario.frecuenciaMinutos),
      fechaInicio: horario.fechaInicio || "",
      fechaFin: horario.fechaFin || "",
    });
    setError("");
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      const payload = {
        ...formData,
        frecuenciaMinutos: timeAMinutos(formData.frecuenciaMinutos),
      };
      if (editingHorario) {
        await horariosService.update(editingHorario.id, payload);
      } else {
        await horariosService.create(payload);
      }
      setError("");
      await fetchHorarios();
      setModalOpen(false);
      setEditingHorario(null);
      setFormData(emptyForm);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setEditingHorario(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este horario?")) {
      return;
    }

    try {
      await horariosService.delete(id);
      await fetchHorarios();
    } catch (err) {
      setError(err.message);
    }
  };

  const getVehiculoLabel = (vehiculoId) => {
    const vehiculo = vehiculos.find((v) => v.id === vehiculoId);
    return vehiculo
      ? `${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}`
      : "Sin vehículo";
  };

  const getRutaLabel = (rutaId) => {
    const ruta = rutas.find((r) => r.id === rutaId);
    return ruta ? ruta.nombre : "Sin ruta";
  };

  const horariosPaginados = horarios;

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "horaSalida", label: "Hora de salida" },
  ];

  return (
    <div className="rutas-container">
      <div className="page-header">
        <h1>Gestión de Horarios</h1>
      </div>
      {error && !modalOpen && <p className="error">{error}</p>}

      <div className="table-container">
        <div className="table-actions" style={{ marginBottom: "1rem" }}>
          <button onClick={handleNuevo} className="button button-primary">
            + Nuevo Horario
          </button>
        </div>

        <TableToolbar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          placeholder="Buscar por ruta, vehículo u hora..."
          sortOptions={sortOptions}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />

        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando horarios...</p>
            </div>
          ) : (
            <>
              <div className="desktop-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Ruta</th>
                      <th>Vehículo</th>
                      <th>Hora de salida</th>
                      <th>Frecuencia</th>
                      <th>Días</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horariosPaginados.length > 0 ? (
                      horariosPaginados.map((horario) => (
                        <tr key={horario.id}>
                          <td>{horario.id}</td>
                          <td>{getRutaLabel(horario.ruta?.id)}</td>
                          <td>{getVehiculoLabel(horario.vehiculo?.id)}</td>
                          <td>{horario.horaSalida || "-"}</td>
                          <td>
                            {horario.frecuenciaMinutos
                              ? minutosATime(horario.frecuenciaMinutos)
                              : "-"}
                          </td>
                          <td>
                            {horario.fechaInicio
                              ? `${horario.fechaInicio.split("-").reverse().join("/")} → ${horario.fechaFin ? horario.fechaFin.split("-").reverse().join("/") : "-"}`
                              : "-"}
                          </td>
                          <td>
                            <ActionsMenu
                              onEdit={() => handleEditar(horario)}
                              onDelete={() => handleEliminar(horario.id)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No se encontraron horarios
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mobile-cards">
                {horariosPaginados.length > 0 ? (
                  <div className="mobile-cards-list">
                    {horariosPaginados.map((horario) => (
                      <div key={horario.id} className="mobile-card">
                        <div className="mobile-card-header">
                          <div className="mobile-card-info">
                            <h3>{getRutaLabel(horario.ruta?.id)}</h3>
                            <p>{getVehiculoLabel(horario.vehiculo?.id)}</p>
                            <p>Salida: {horario.horaSalida || "-"}</p>
                          </div>
                        </div>
                        <div className="mobile-card-body">
                          <div className="mobile-card-row">
                          <span>Frecuencia</span>
                          <span>
                            {horario.frecuenciaMinutos
                              ? minutosATime(horario.frecuenciaMinutos)
                              : "-"}
                          </span>
                          </div>
                          <div className="mobile-card-row">
                            <span>Días</span>
                            <span>{horario.fechaInicio ? `${horario.fechaInicio.split("-").reverse().join("/")} → ${horario.fechaFin ? horario.fechaFin.split("-").reverse().join("/") : "-"}` : "-"}</span>
                          </div>
                        </div>
                        <div className="mobile-card-actions">
                          <ActionsMenu
                            onEdit={() => handleEditar(horario)}
                            onDelete={() => handleEliminar(horario.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mobile-empty">
                    No hay horarios disponibles
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
            totalItems={pagination?.totalRegistros || horarios.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={editingHorario ? "Editar Horario" : "Nuevo Horario"}
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
              Ruta
            </label>
            <select
              value={formData.rutaId}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  rutaId: value === "" ? "" : parseInt(value, 10),
                });
              }}
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
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Vehículo
            </label>
            <select
              value={formData.vehiculoId}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  vehiculoId: value === "" ? "" : parseInt(value, 10),
                });
              }}
              className="input"
              style={{ width: "100%" }}
              required
            >
              <option value="">Seleccionar vehículo</option>
              {vehiculos.map((vehiculo) => (
                <option key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}
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
              Hora de salida
            </label>
            <input
              type="time"
              value={formData.horaSalida}
              onChange={(e) =>
                setFormData({ ...formData, horaSalida: e.target.value })
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
              Frecuencia (HH:mm)
            </label>
            <input
              type="time"
              value={formData.frecuenciaMinutos}
              onChange={(e) =>
                setFormData({ ...formData, frecuenciaMinutos: e.target.value })
              }
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
              Fecha de inicio
            </label>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="date"
                value={formData.fechaInicio}
                onChange={(e) =>
                  setFormData({ ...formData, fechaInicio: e.target.value })
                }
                className="input"
                style={{ flex: 1 }}
              />
              <span style={{ color: "#999" }}>→</span>
              <input
                type="date"
                value={formData.fechaFin}
                onChange={(e) =>
                  setFormData({ ...formData, fechaFin: e.target.value })
                }
                className="input"
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {error && (
            <p className="error" style={{ marginBottom: "1rem" }}>
              {error}
            </p>
          )}

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
