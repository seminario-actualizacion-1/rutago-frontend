import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import { conductoresService } from "../../services/conductores.service";
import { usuariosService } from "../../services/usuarios.service";
import { vehiculosService } from "../../services/vehiculos.service";
import { ESTADOS_CONDUCTOR } from "../../config/estados";
import "./Conductores.css";

const emptyForm = {
  nombres: "",
  apellidos: "",
  correo: "",
  contrasena: "",
  usuarioId: "",
  vehiculoId: "",
  licenciaConducir: "",
  estadoId: 1,
};

export default function Conductores() {
  const [conductores, setConductores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
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
  const [editingConductor, setEditingConductor] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ estadoId: "" });
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [conductoresData, usuariosData, vehiculosData] =
          await Promise.all([
            conductoresService.getAll({
              paginaActual: currentPage,
              registrosPorPagina: itemsPerPage,
              q: searchTerm || undefined,
              ...(filters.estadoId && { estadoId: filters.estadoId }),
              sortBy,
              sortOrder,
            }),
            usuariosService.getAll({
              paginaActual: 1,
              registrosPorPagina: 100,
            }),
            vehiculosService.getAll({
              paginaActual: 1,
              registrosPorPagina: 100,
            }),
          ]);

        setConductores(conductoresData.data || []);
        setPagination(
          conductoresData.paginacion || {
            paginaActual: currentPage,
            registrosPorPagina: itemsPerPage,
            totalPaginas: 1,
            totalRegistros: conductoresData.data?.length || 0,
            tienePaginaAnterior: false,
            tienePaginaSiguiente: false,
          },
        );
        setUsuarios(usuariosData.data || []);
        setVehiculos(vehiculosData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, itemsPerPage, searchTerm, filters, refreshKey, sortBy, sortOrder]);

  const handleNuevo = () => {
    setEditingConductor(null);
    setFormData(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const handleEditar = (conductor) => {
    setEditingConductor(conductor);
    setFormData({
      nombres: conductor.usuario?.nombres || "",
      apellidos: conductor.usuario?.apellidos || "",
      correo: conductor.usuario?.correo || "",
      contrasena: "",
      usuarioId: conductor.usuarioId,
      vehiculoId: conductor.vehiculoId || "",
      licenciaConducir: conductor.licenciaConducir || "",
      estadoId: conductor.estadoId || 1,
    });
    setError("");
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      if (editingConductor) {
        // Resolver usuarioId: puede venir como propiedad plana o anidada
        const usuarioIdEdicion =
          editingConductor.usuarioId ?? editingConductor.usuario?.id ?? null;

        // Solo actualizar el usuario si existe la asociación
        if (usuarioIdEdicion) {
          await usuariosService.update(usuarioIdEdicion, {
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            correo: formData.correo,
          });
        }

        await conductoresService.update(editingConductor.id, {
          vehiculoId: formData.vehiculoId || null,
          licenciaConducir: formData.licenciaConducir,
          estadoId: formData.estadoId,
        });
      } else {
        const usuarioResponse = await usuariosService.create({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo: formData.correo,
          contrasena: formData.contrasena,
          rolId: 2,
        });

        const usuarioId = usuarioResponse.usuario?.id;
        if (!usuarioId)
          throw new Error("No se pudo obtener el ID del usuario creado.");

        await conductoresService.create({
          usuarioId,
          vehiculoId: formData.vehiculoId || null,
          licenciaConducir: formData.licenciaConducir,
          estadoId: formData.estadoId,
        });
      }
      setCurrentPage(1);
      const [conductoresData, usuariosData, vehiculosData] = await Promise.all([
        conductoresService.getAll({
          paginaActual: 1,
          registrosPorPagina: itemsPerPage,
        }),
        usuariosService.getAll({
          paginaActual: 1,
          registrosPorPagina: 100,
        }),
        vehiculosService.getAll({
          paginaActual: 1,
          registrosPorPagina: 100,
        }),
      ]);
      setConductores(conductoresData.data || []);
      setPagination(
        conductoresData.paginacion || {
          paginaActual: currentPage,
          registrosPorPagina: itemsPerPage,
          totalPaginas: 1,
          totalRegistros: conductoresData.data?.length || 0,
          tienePaginaAnterior: false,
          tienePaginaSiguiente: false,
        },
      );
      setUsuarios(usuariosData.data || []);
      setVehiculos(vehiculosData.data || []);
      setModalOpen(false);
      setEditingConductor(null);
      setFormData(emptyForm);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setEditingConductor(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleEliminar = async (id) => {
    if (
      !window.confirm("¿Estás seguro de que deseas eliminar este conductor?")
    ) {
      return;
    }

    try {
      await conductoresService.delete(id);
      setCurrentPage(1);
      setRefreshKey(k => k + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "licenciaConducir", label: "Licencia" },
    { value: "estado", label: "Estado" },
  ];

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const getUsuarioNombre = (conductor) => {
    if (conductor.usuario) {
      return `${conductor.usuario.nombres} ${conductor.usuario.apellidos || ""}`.trim();
    }

    const usuario = usuarios.find((u) => u.id === conductor.usuarioId);
    return usuario
      ? `${usuario.nombres} ${usuario.apellidos || ""}`.trim()
      : "Sin usuario";
  };

  const getVehiculoPlaca = (conductor) => {
    if (conductor.vehiculo) {
      return conductor.vehiculo.placa;
    }

    const vehiculo = vehiculos.find((v) => v.id === conductor.vehiculoId);
    return vehiculo ? vehiculo.placa : "Sin vehículo";
  };

  const getEstadoColor = (estadoId) => {
    const colors = {
      1: "badge-disponible",
      2: "badge-en-viaje",
      3: "badge-inactivo",
    };
    return colors[estadoId] || "badge-default";
  };

  const conductoresPaginados = conductores;

  if (loading)
    return (
      <div className="conductores-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando conductores...</p>
        </div>
      </div>
    );

  return (
    <div className="conductores-container">
      <div className="page-header">
        <h1>Gestión de Conductores</h1>
      </div>
      {error && !modalOpen && <p className="error">{error}</p>}

      <div className="table-container">
        <div className="table-actions" style={{ marginBottom: "1rem" }}>
          <button onClick={handleNuevo} className="button button-primary">
            + Nuevo Conductor
          </button>
        </div>

      <TableToolbar
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Buscar por nombres, apellidos, correo o licencia..."
        filters={[
          {
            name: "estadoId",
            label: "Todos los estados",
            value: filters.estadoId,
            options: [
              { value: 1, label: "Disponible" },
              { value: 2, label: "En viaje" },
              { value: 3, label: "Inactivo" },
            ],
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
                  <th>Usuario</th>
                  <th>Vehículo</th>
                  <th>Licencia</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {conductoresPaginados.length > 0 ? (
                  conductoresPaginados.map((conductor) => (
                    <tr key={conductor.id}>
                      <td>{conductor.id}</td>
                      <td>
                        <span className="font-medium">
                          {getUsuarioNombre(conductor)}
                        </span>
                      </td>
                      <td>{getVehiculoPlaca(conductor)}</td>
                      <td>{conductor.licenciaConducir || "-"}</td>
                      <td>
                        <span
                          className={`badge ${getEstadoColor(conductor.estadoId)}`}
                        >
                          {ESTADOS_CONDUCTOR[conductor.estadoId] || conductor.estadoId || 1}
                        </span>
                      </td>
                      <td>
                        <ActionsMenu
                          onEdit={() => handleEditar(conductor)}
                          onDelete={() => handleEliminar(conductor.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No se encontraron conductores
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {conductoresPaginados.length > 0 ? (
              <div className="mobile-cards-list">
                {conductoresPaginados.map((conductor) => (
                  <div key={conductor.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-info">
                        <h3>{getUsuarioNombre(conductor)}</h3>
                        <p>{getVehiculoPlaca(conductor)}</p>
                        <p>Licencia: {conductor.licenciaConducir || "-"}</p>
                      </div>
                      <span
                        className={`mobile-badge ${getEstadoColor(conductor.estadoId)}`}
                      >
                        {(ESTADOS_CONDUCTOR[conductor.estadoId] || conductor.estadoId || 1).toString().toUpperCase()}
                      </span>
                    </div>

                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <span>ID</span>
                        <span>{conductor.id}</span>
                      </div>
                    </div>

                    <div className="mobile-card-actions">
                      <ActionsMenu
                        onEdit={() => handleEditar(conductor)}
                        onDelete={() => handleEliminar(conductor.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mobile-empty">No hay conductores disponibles</div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPaginas || 1}
          totalItems={pagination.totalRegistros || conductores.length}
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
        title={editingConductor ? "Editar Conductor" : "Nuevo Conductor"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGuardar();
          }}
        >
          {!editingConductor ? (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Nombres
                </label>
                <input
                  type="text"
                  value={formData.nombres}
                  onChange={(e) =>
                    setFormData({ ...formData, nombres: e.target.value })
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
                  Apellidos
                </label>
                <input
                  type="text"
                  value={formData.apellidos}
                  onChange={(e) =>
                    setFormData({ ...formData, apellidos: e.target.value })
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
                  Correo
                </label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
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
                  Contraseña
                </label>
                <input
                  type="password"
                  value={formData.contrasena}
                  onChange={(e) =>
                    setFormData({ ...formData, contrasena: e.target.value })
                  }
                  className="input"
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Nombres
                </label>
                <input
                  type="text"
                  value={formData.nombres}
                  onChange={(e) =>
                    setFormData({ ...formData, nombres: e.target.value })
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
                  Apellidos
                </label>
                <input
                  type="text"
                  value={formData.apellidos}
                  onChange={(e) =>
                    setFormData({ ...formData, apellidos: e.target.value })
                  }
                  className="input"
                  style={{ width: "100%" }}
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
                  Correo
                </label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                  className="input"
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </>
          )}
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
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vehiculoId: e.target.value ? parseInt(e.target.value) : "",
                })
              }
              className="input"
              style={{ width: "100%" }}
            >
              <option value="">Seleccionar vehículo (opcional)</option>
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
              Licencia
            </label>
            <input
              type="text"
              value={formData.licenciaConducir}
              onChange={(e) =>
                setFormData({ ...formData, licenciaConducir: e.target.value })
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
              <option value="1">Disponible</option>
              <option value="2">En viaje</option>
              <option value="3">Inactivo</option>
            </select>
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
