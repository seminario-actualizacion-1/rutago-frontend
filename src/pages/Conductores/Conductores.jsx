import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import { conductoresService } from "../../services/conductores.service";
import { usuariosService } from "../../services/usuarios.service";
import { vehiculosService } from "../../services/vehiculos.service";
import "./Conductores.css";

const emptyForm = {
  nombres: "",
  apellidos: "",
  correo: "",
  contrasena: "",
  usuarioId: "",
  vehiculoId: "",
  licenciaConducir: "",
  estado: "DISPONIBLE",
};

export default function Conductores() {
  const [conductores, setConductores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConductor, setEditingConductor] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchConductores = async () => {
    try {
      const data = await conductoresService.getAll();
      setConductores(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const data = await usuariosService.getAll();
      setUsuarios(data.data || []);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const fetchVehiculos = async () => {
    try {
      const data = await vehiculosService.getAll();
      setVehiculos(data.data || []);
    } catch (err) {
      console.error("Error al cargar vehículos:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchConductores(),
        fetchUsuarios(),
        fetchVehiculos(),
      ]);
    };

    loadData();
  }, []);

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
      estado: conductor.estado || "DISPONIBLE",
    });
    setError("");
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      if (editingConductor) {
        await usuariosService.update(editingConductor.usuarioId, {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo: formData.correo,
        });

        await conductoresService.update(editingConductor.id, {
          usuarioId: editingConductor.usuarioId,
          vehiculoId: formData.vehiculoId || null,
          licenciaConducir: formData.licenciaConducir,
          estado: formData.estado,
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
          estado: formData.estado,
        });
      }
      await fetchConductores();
      await fetchUsuarios();
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
      await fetchConductores();
    } catch (err) {
      setError(err.message);
    }
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

  const getEstadoColor = (estado) => {
    const colors = {
      DISPONIBLE: "badge-disponible",
      EN_VIAJE: "badge-en-viaje",
      INACTIVO: "badge-inactivo",
    };
    return colors[estado] || "badge-default";
  };

  // Pagination logic
  const totalPages = Math.ceil(conductores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const conductoresPaginados = conductores.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading)
    return (
      <div className="conductores-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando conductores...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="conductores-container">
        <p className="error">{error}</p>
      </div>
    );

  return (
    <div className="conductores-container">
      <div className="page-header">
        <h1>Gestión de Conductores</h1>
      </div>

      <div className="table-container">
        <div className="table-actions" style={{ marginBottom: "1rem" }}>
          <button onClick={handleNuevo} className="button button-primary">
            + Nuevo Conductor
          </button>
        </div>
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
                          className={`badge ${getEstadoColor(conductor.estado)}`}
                        >
                          {conductor.estado || "DISPONIBLE"}
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
                        className={`mobile-badge ${getEstadoColor(conductor.estado)}`}
                      >
                        {(conductor.estado || "DISPONIBLE").toUpperCase()}
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
          totalPages={totalPages}
          totalItems={conductores.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
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
              value={formData.estado}
              onChange={(e) =>
                setFormData({ ...formData, estado: e.target.value })
              }
              className="input"
              style={{ width: "100%" }}
              required
            >
              <option value="DISPONIBLE">Disponible</option>
              <option value="EN_VIAJE">En viaje</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>
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
