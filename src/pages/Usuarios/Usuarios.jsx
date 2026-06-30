import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import { usuariosService } from "../../services/usuarios.service";
import { vehiculosService } from "../../services/vehiculos.service";
import { perfilConductorService } from "../../services/perfilConductor.service";
import { perfilEntidadService } from "../../services/perfilEntidad.service";
import "./Usuarios.css";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [filtroRol, setFiltroRol] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    contrasena: "",
    rolId: "",
    // Campos de Conductor
    licenciaConducir: "",
    vehiculoId: "",
    estadoConductor: "DISPONIBLE",
    // Campos de Entidad
    razonSocial: "",
    nit: "",
    telefonoContacto: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsuarios = async () => {
    try {
      const data = await usuariosService.getAll();
      setUsuarios(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      await Promise.all([fetchUsuarios(), fetchVehiculos()]);
    };

    loadData();
  }, []);

  const handleEditar = async (usuario) => {
    try {
      setError("");

      const usuarioResponse = await usuariosService.getById(usuario.id);
      const usuarioCompleto = usuarioResponse.data || usuario;

      let perfilConductor = usuarioCompleto.perfilConductor || null;
      let perfilEntidad = usuarioCompleto.perfilEntidad || null;

      if (usuarioCompleto.rolId === 2 && perfilConductor?.id) {
        const perfilConductorResponse = await perfilConductorService.getById(
          perfilConductor.id,
        );
        perfilConductor = perfilConductorResponse.data || perfilConductor;
      }

      if (usuarioCompleto.rolId === 4 && perfilEntidad?.id) {
        const perfilEntidadResponse = await perfilEntidadService.getById(
          perfilEntidad.id,
        );
        perfilEntidad = perfilEntidadResponse.data || perfilEntidad;
      }

      const usuarioEditando = {
        ...usuarioCompleto,
        perfilConductor,
        perfilEntidad,
      };

      const nuevoFormData = {
        nombres: usuarioEditando.nombres,
        apellidos: usuarioEditando.apellidos || "",
        correo: usuarioEditando.correo,
        contrasena: "",
        rolId: Number(usuarioEditando.rolId),
        licenciaConducir:
          usuarioEditando.perfilConductor?.licenciaConducir || "",
        vehiculoId:
          usuarioEditando.perfilConductor?.vehiculoId != null
            ? Number(usuarioEditando.perfilConductor.vehiculoId)
            : "",
        estadoConductor:
          usuarioEditando.perfilConductor?.estado || "DISPONIBLE",
        razonSocial: usuarioEditando.perfilEntidad?.razonSocial || "",
        nit: usuarioEditando.perfilEntidad?.nit || "",
        telefonoContacto: usuarioEditando.perfilEntidad?.telefonoContacto || "",
      };

      setEditingUsuario(usuarioEditando);
      setFormData(nuevoFormData);
      setModalOpen(true);
    } catch (err) {
      setError(err.message || "Error al cargar los datos del usuario");
    }
  };

  const handleGuardar = async () => {
    try {
      let usuarioId;
      const rolId = Number(formData.rolId);

      // Guardar usuario principal
      if (editingUsuario) {
        const usuarioData = {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo: formData.correo,
          rolId,
        };
        await usuariosService.update(editingUsuario.id, usuarioData);
        usuarioId = editingUsuario.id;

        if (editingUsuario.rolId !== rolId) {
          await usuariosService.changeRole(usuarioId, rolId);
        }
      } else {
        const usuarioData = {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo: formData.correo,
          contrasena: formData.contrasena,
          rolId,
        };
        const response = await usuariosService.create(usuarioData);
        usuarioId = response.usuario?.id || response.data?.id || response.id;
        if (!usuarioId) {
          throw new Error("No se pudo obtener el ID del usuario creado.");
        }
      }

      // Opción A: mantener un único perfil especializado acorde al rol actual
      if (rolId !== 2 && editingUsuario?.perfilConductor) {
        await perfilConductorService.delete(editingUsuario.perfilConductor.id);
      }

      if (rolId !== 4 && editingUsuario?.perfilEntidad) {
        await perfilEntidadService.delete(editingUsuario.perfilEntidad.id);
      }

      // Guardar perfil adicional según rol
      if (rolId === 2) {
        const perfilConductorData = {
          usuarioId,
          vehiculoId: formData.vehiculoId || null,
          licenciaConducir: formData.licenciaConducir,
          estado: formData.estadoConductor,
        };

        if (editingUsuario && editingUsuario.perfilConductor) {
          await perfilConductorService.update(
            editingUsuario.perfilConductor.id,
            perfilConductorData,
          );
        } else {
          await perfilConductorService.create(perfilConductorData);
        }
      } else if (rolId === 4) {
        const perfilEntidadData = {
          usuarioId,
          razonSocial: formData.razonSocial,
          nit: formData.nit,
          telefonoContacto: formData.telefonoContacto,
        };

        if (editingUsuario && editingUsuario.perfilEntidad) {
          await perfilEntidadService.update(
            editingUsuario.perfilEntidad.id,
            perfilEntidadData,
          );
        } else {
          await perfilEntidadService.create(perfilEntidadData);
        }
      }

      await fetchUsuarios();
      setModalOpen(false);
      setEditingUsuario(null);
      setFormData({
        nombres: "",
        apellidos: "",
        correo: "",
        contrasena: "",
        rolId: "",
        licenciaConducir: "",
        vehiculoId: "",
        estadoConductor: "DISPONIBLE",
        razonSocial: "",
        nit: "",
        telefonoContacto: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setEditingUsuario(null);
    setFormData({
      nombres: "",
      apellidos: "",
      correo: "",
      contrasena: "",
      rolId: "",
      licenciaConducir: "",
      vehiculoId: "",
      estadoConductor: "DISPONIBLE",
      razonSocial: "",
      nit: "",
      telefonoContacto: "",
    });
  };

  const handleEliminar = async (usuario) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar a ${usuario.nombres}?`,
      )
    ) {
      return;
    }

    try {
      if (usuario.perfilConductor) {
        await perfilConductorService.delete(usuario.perfilConductor.id);
      }

      if (usuario.perfilEntidad) {
        await perfilEntidadService.delete(usuario.perfilEntidad.id);
      }

      await usuariosService.delete(usuario.id);
      await fetchUsuarios();
    } catch (err) {
      setError(err.message);
    }
  };

  const usuariosFiltrados =
    filtroRol === "todos"
      ? usuarios
      : usuarios.filter((u) => u.rolId === parseInt(filtroRol));

  const rolSeleccionado = Number(formData.rolId);

  // Pagination logic
  const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const usuariosPaginados = usuariosFiltrados.slice(startIndex, endIndex);

  const getRolNombre = (rolId) => {
    const roles = {
      1: "Administrador",
      2: "Conductor",
      3: "Pasajero",
      4: "Entidad Externa",
    };
    return roles[rolId] || "Desconocido";
  };

  const getRolColor = (rolId) => {
    const colors = {
      1: "badge-admin",
      2: "badge-conductor",
      3: "badge-pasajero",
      4: "badge-entidad",
    };
    return colors[rolId] || "badge-default";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading)
    return (
      <div className="usuarios-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="usuarios-container">
        <p className="error">{error}</p>
      </div>
    );

  return (
    <div className="usuarios-container">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
      </div>

      <div className="filter-container">
        <label className="filter-label">
          Filtrar por rol:
          <select
            value={filtroRol}
            onChange={(e) => {
              setFiltroRol(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="todos">Todos</option>
            <option value="1">Administrador</option>
            <option value="2">Conductor</option>
            <option value="3">Pasajero</option>
            <option value="4">Entidad Externa</option>
          </select>
        </label>
      </div>

      <div className="table-actions" style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => {
            setEditingUsuario(null);
            setFormData({
              nombres: "",
              apellidos: "",
              correo: "",
              contrasena: "",
              rolId: "",
              licenciaConducir: "",
              vehiculoId: "",
              estadoConductor: "DISPONIBLE",
              razonSocial: "",
              nit: "",
              telefonoContacto: "",
            });
            setModalOpen(true);
          }}
          className="button button-primary"
        >
          + Nuevo Usuario
        </button>
      </div>

      <div className="usuarios-table-wrapper">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Desktop Table */}
          <div className="desktop-table">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPaginados.length > 0 ? (
                  usuariosPaginados.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>
                        <span className="font-medium">{usuario.nombres}</span>
                      </td>
                      <td>{usuario.apellidos || "-"}</td>
                      <td>{usuario.correo}</td>
                      <td>
                        <span className={`badge ${getRolColor(usuario.rolId)}`}>
                          {getRolNombre(usuario.rolId)}
                        </span>
                      </td>
                      <td>
                        <ActionsMenu
                          onEdit={() => handleEditar(usuario)}
                          onDelete={() => handleEliminar(usuario)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {usuariosPaginados.length > 0 ? (
              <div className="mobile-cards-list">
                {usuariosPaginados.map((usuario) => (
                  <div key={usuario.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-info">
                        <h3>{usuario.nombres}</h3>
                        <p>{usuario.apellidos || "Sin apellidos"}</p>
                        <p>{usuario.correo}</p>
                      </div>
                      <span
                        className={`mobile-badge ${getRolColor(usuario.rolId)}`}
                      >
                        {getRolNombre(usuario.rolId).toUpperCase()}
                      </span>
                    </div>

                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <span>ID</span>
                        <span>{usuario.id}</span>
                      </div>
                    </div>

                    <div className="mobile-card-actions">
                      <ActionsMenu
                        onEdit={() => handleEditar(usuario)}
                        onDelete={() => handleEliminar(usuario)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mobile-empty">No hay usuarios disponibles</div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={usuariosFiltrados.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}
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
          {!editingUsuario && (
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
          )}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Rol
            </label>
            <select
              value={formData.rolId}
              onChange={(e) =>
                setFormData({ ...formData, rolId: parseInt(e.target.value) })
              }
              className="input"
              style={{ width: "100%" }}
              required
            >
              <option value="">Seleccionar rol</option>
              <option value="1">Administrador</option>
              <option value="2">Conductor</option>
              <option value="3">Pasajero</option>
              <option value="4">Entidad Externa</option>
            </select>
          </div>

          {/* Campos específicos para Conductor */}
          {rolSeleccionado === 2 && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Licencia de Conducir
                </label>
                <input
                  type="text"
                  value={formData.licenciaConducir}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      licenciaConducir: e.target.value,
                    })
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
                  Vehículo
                </label>
                <select
                  value={formData.vehiculoId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehiculoId: parseInt(e.target.value),
                    })
                  }
                  className="input"
                  style={{ width: "100%" }}
                >
                  <option value="">Sin vehículo asignado</option>
                  {vehiculos.map((vehiculo) => (
                    <option key={vehiculo.id} value={vehiculo.id}>
                      {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}
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
                  Estado
                </label>
                <select
                  value={formData.estadoConductor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estadoConductor: e.target.value,
                    })
                  }
                  className="input"
                  style={{ width: "100%" }}
                >
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="EN_VIAJE">En viaje</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>
            </>
          )}

          {/* Campos específicos para Entidad Externa */}
          {rolSeleccionado === 4 && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Razón Social
                </label>
                <input
                  type="text"
                  value={formData.razonSocial}
                  onChange={(e) =>
                    setFormData({ ...formData, razonSocial: e.target.value })
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
                  NIT
                </label>
                <input
                  type="text"
                  value={formData.nit}
                  onChange={(e) =>
                    setFormData({ ...formData, nit: e.target.value })
                  }
                  className="input"
                  style={{ width: "100%" }}
                  required
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
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  value={formData.telefonoContacto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      telefonoContacto: e.target.value,
                    })
                  }
                  className="input"
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </>
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
