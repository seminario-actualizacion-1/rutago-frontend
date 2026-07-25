import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import { horariosService } from "../../services/horarios.service";
import { rutasService } from "../../services/rutas.service";
import { vehiculosService } from "../../services/vehiculos.service";
import { usePaginacion } from "../../hooks/usePaginacion";

const frecuenciaOptions = [
  { value: "", label: "Sin frecuencia definida" },
  { value: 10, label: "Cada 10 minutos" },
  { value: 15, label: "Cada 15 minutos" },
  { value: 20, label: "Cada 20 minutos" },
  { value: 30, label: "Cada 30 minutos" },
  { value: 45, label: "Cada 45 minutos" },
  { value: 60, label: "Cada 60 minutos" },
];

const diasSemanaOptions = [
  "Lunes a Viernes",
  "Lunes a Sábado",
  "Todos los días",
  "Solo Lunes",
  "Solo Martes",
  "Solo Miércoles",
  "Solo Jueves",
  "Solo Viernes",
  "Solo Sábado",
  "Solo Domingo",
  "Sábados y Domingos",
];

const emptyForm = {
  vehiculoId: "",
  rutaId: "",
  horaSalida: "",
  frecuenciaMinutos: "",
  diasSemana: "",
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
      frecuenciaMinutos: horario.frecuenciaMinutos || "",
      diasSemana: horario.diasSemana || "",
    });
    setError("");
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      if (editingHorario) {
        await horariosService.update(editingHorario.id, formData);
      } else {
        await horariosService.create(formData);
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
    { value: "horaSalida", label: "Hora de salida" }
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
                  <th title="Identificador único del horario">ID</th>
                  <th title="Nombre de la ruta asociada">Ruta</th>
                  <th title="Vehículo asignado a este horario">Vehículo</th>
                  <th title="Hora de salida programada">Hora de salida</th>
                  <th title="Intervalo de tiempo entre cada salida">Frecuencia</th>
                  <th title="Días de la semana en que aplica el horario">Días</th>
                  <th title="Opciones disponibles para este registro">Acciones</th>
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
                          ? `${horario.frecuenciaMinutos} min`
                          : "-"}
                      </td>
                      <td>{horario.diasSemana || "-"}</td>
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
                            ? `${horario.frecuenciaMinutos} min`
                            : "-"}
                        </span>
                      </div>
                      <div className="mobile-card-row">
                        <span>Días</span>
                        <span>{horario.diasSemana || "-"}</span>
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
              <div className="mobile-empty">No hay horarios disponibles</div>
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
              Frecuencia (minutos)
            </label>
            <select
              value={formData.frecuenciaMinutos}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  frecuenciaMinutos: value === "" ? "" : parseInt(value, 10),
                });
              }}
              className="input"
              style={{ width: "100%" }}
            >
              {frecuenciaOptions.map((option) => (
                <option key={String(option.value)} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Días de la semana
            </label>
            <select
              value={formData.diasSemana}
              onChange={(e) =>
                setFormData({ ...formData, diasSemana: e.target.value })
              }
              className="input"
              style={{ width: "100%" }}
            >
              <option value="">Seleccionar días</option>
              {diasSemanaOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
