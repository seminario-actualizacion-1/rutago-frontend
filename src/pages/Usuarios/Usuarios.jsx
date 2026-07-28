import { useState, useEffect } from "react";
import { useRoles } from "../../hooks/useRoles";
import { usePaginacion } from "../../hooks/usePaginacion";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import { usuariosService } from "../../services/usuarios.service";
import { vehiculosService } from "../../services/vehiculos.service";
import { perfilConductorService } from "../../services/perfilConductor.service";
import { perfilEntidadService } from "../../services/perfilEntidad.service";
import { perfilPasajeroService } from "../../services/perfilPasajero.service";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import UsuariosConductor from "./UsuariosConductor";
import UsuariosPasajero from "./UsuariosPasajero";
import UsuariosEntidad from "./UsuariosEntidad";
import "./Usuarios.css";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
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
    estadoConductor: 1,
    // Campos de Entidad
    razonSocial: "",
    nit: "",
    telefonoContacto: "",
    // Campos de Pasajero
    telefono: "",
    direccion: "",
    tipoDocumentoId: "",
    numeroDocumento: "",
    fechaNacimiento: "",
  });

  const {
    currentPage,
    itemsPerPage,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    actualizarPaginacion,
    queryParams,
    setCurrentPage,
  } = usePaginacion();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ rolId: "" });
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");

  const { opciones: opcionesRoles, nombre: nombreRol, data: roles } = useRoles();

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const params = {
        ...queryParams,
        q: searchTerm || undefined,
        sortBy,
        sortOrder,
      };

      if (filters.rolId) {
        params.rolId = filters.rolId;
      }

      const data = await usuariosService.getAll(params);
      setUsuarios(data.data || []);
      actualizarPaginacion(data.paginacion);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehiculos = async () => {
    try {
      // Obtener todos los vehículos (sin paginación para el select)
      const data = await vehiculosService.getAll({
        paginaActual: 1,
        registrosPorPagina: 100,
      });
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
  }, [currentPage, itemsPerPage, searchTerm, filters, sortBy, sortOrder]);

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

  const handleEditar = async (usuario) => {
    try {
      setError("");

      const usuarioResponse = await usuariosService.getById(usuario.id);
      const usuarioCompleto = usuarioResponse.data || usuario;

      let perfilConductor = usuarioCompleto.perfilConductor || null;
      let perfilEntidad = usuarioCompleto.perfilEntidad || null;

      if (usuarioCompleto.rol?.id === 2 && perfilConductor?.id) {
        const perfilConductorResponse = await perfilConductorService.getById(
          perfilConductor.id,
        );
        perfilConductor = perfilConductorResponse.data || perfilConductor;
      }

      if (usuarioCompleto.rol?.id === 4 && perfilEntidad?.id) {
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
        rolId: Number(usuarioEditando.rol?.id),
        licenciaConducir:
          usuarioEditando.perfilConductor?.licenciaConducir || "",
        vehiculoId:
          usuarioEditando.perfilConductor?.vehiculo?.id != null
            ? Number(usuarioEditando.perfilConductor.vehiculo.id)
            : "",
        estadoConductor: usuarioEditando.perfilConductor?.estadoId || 1,
        razonSocial: usuarioEditando.perfilEntidad?.razonSocial || "",
        nit: usuarioEditando.perfilEntidad?.nit || "",
        telefonoContacto: usuarioEditando.perfilEntidad?.telefonoContacto || "",
        telefono: usuarioEditando.perfilPasajero?.telefono || "",
        direccion: usuarioEditando.perfilPasajero?.direccion || "",
        tipoDocumentoId:
          usuarioEditando.perfilPasajero?.tipoDocumento?.id?.toString() || "",
        numeroDocumento: usuarioEditando.perfilPasajero?.numeroDocumento || "",
        fechaNacimiento: usuarioEditando.perfilPasajero?.fechaNacimiento
          ? usuarioEditando.perfilPasajero.fechaNacimiento.split("T")[0]
          : "",
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

        if (editingUsuario.rol?.id !== rolId) {
          await usuariosService.changeRole(usuarioId, rolId);
        }
      } else if (rolId === 2) {
        const res = await perfilConductorService.crearConUsuario({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo: formData.correo,
          contrasena: formData.contrasena,
          vehiculoId: formData.vehiculoId || null,
          licenciaConducir: formData.licenciaConducir,
          estadoId: formData.estadoConductor,
        });
        usuarioId = res.data?.usuario?.id;
      } else if (rolId === 4) {
        const res = await perfilEntidadService.crearConUsuario({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo: formData.correo,
          contrasena: formData.contrasena,
          razonSocial: formData.razonSocial,
          nit: formData.nit,
          telefonoContacto: formData.telefonoContacto,
        });
        usuarioId = res.data?.usuario?.id;
      } else if (rolId === 3) {
        const res = await perfilPasajeroService.crearConUsuario({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo: formData.correo,
          contrasena: formData.contrasena,
          telefono: formData.telefono,
          direccion: formData.direccion,
          tipoDocumentoId: formData.tipoDocumentoId,
          numeroDocumento: formData.numeroDocumento,
          fechaNacimiento: formData.fechaNacimiento || null,
        });
        usuarioId = res.data?.usuario?.id;
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
      }

      if (!usuarioId && !editingUsuario) {
        throw new Error("No se pudo obtener el ID del usuario creado.");
      }

      // En edición, limpiar perfiles que ya no corresponden
      if (editingUsuario) {
        if (rolId !== 2 && editingUsuario.perfilConductor) {
          await perfilConductorService.delete(
            editingUsuario.perfilConductor.id,
          );
        }
        if (rolId !== 4 && editingUsuario.perfilEntidad) {
          await perfilEntidadService.delete(editingUsuario.perfilEntidad.id);
        }
        if (rolId !== 3 && editingUsuario.perfilPasajero) {
          await perfilPasajeroService.delete(editingUsuario.perfilPasajero.id);
        }

        // Guardar perfil adicional según rol (solo edición)
        if (rolId === 2 && editingUsuario.perfilConductor) {
          await perfilConductorService.update(
            editingUsuario.perfilConductor.id,
            {
              usuarioId,
              vehiculoId: formData.vehiculoId || null,
              licenciaConducir: formData.licenciaConducir,
              estadoId: formData.estadoConductor,
            },
          );
        } else if (rolId === 4 && editingUsuario.perfilEntidad) {
          await perfilEntidadService.update(editingUsuario.perfilEntidad.id, {
            usuarioId,
            razonSocial: formData.razonSocial,
            nit: formData.nit,
            telefonoContacto: formData.telefonoContacto,
          });
        } else if (rolId === 3 && editingUsuario.perfilPasajero) {
          await perfilPasajeroService.update(editingUsuario.perfilPasajero.id, {
            usuarioId,
            telefono: formData.telefono,
            direccion: formData.direccion,
            tipoDocumentoId: formData.tipoDocumentoId,
            numeroDocumento: formData.numeroDocumento,
            fechaNacimiento: formData.fechaNacimiento || null,
          });
        }
      }

      setCurrentPage(1);
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
        estadoConductor: 1,
        razonSocial: "",
        nit: "",
        telefonoContacto: "",
        telefono: "",
        direccion: "",
        tipoDocumentoId: "",
        numeroDocumento: "",
        fechaNacimiento: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarModal = () => {
    setError("");
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
      estadoConductor: 1,
      razonSocial: "",
      nit: "",
      telefonoContacto: "",
      telefono: "",
      direccion: "",
      tipoDocumentoId: "",
      numeroDocumento: "",
      fechaNacimiento: "",
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

      if (usuario.perfilPasajero) {
        await perfilPasajeroService.delete(usuario.perfilPasajero.id);
      }

      await usuariosService.delete(usuario.id);
      setCurrentPage(1);
      await fetchUsuarios();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const rolSeleccionado = Number(formData.rolId);

  const usuariosPaginados = usuarios;

  const getRolNombre = (rolId) => { return nombreRol(rolId) || "Desconocido"; };

  const getRolColor = (rolId) => {
    const colors = {
      1: "badge-admin",
      2: "badge-conductor",
      3: "badge-pasajero",
      4: "badge-entidad",
    };
    return colors[rolId] || "badge-default";
  };

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "nombres", label: "Nombres" },
    { value: "apellidos", label: "Apellidos" },
    { value: "correo", label: "Correo" },
    { value: "rolId", label: "Rol" },
  ];

  return (
    <div className="usuarios-container">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
      </div>
      {error && !modalOpen && <p className="error">{error}</p>}

      <div className="table-container">
        <div className="table-actions" style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => {
              setError("");
              setEditingUsuario(null);
              setFormData({
                nombres: "",
                apellidos: "",
                correo: "",
                contrasena: "",
                rolId: "",
                licenciaConducir: "",
                vehiculoId: "",
                estadoConductor: 1,
                razonSocial: "",
                nit: "",
                telefonoContacto: "",
                telefono: "",
                direccion: "",
                tipoDocumentoId: "",
                numeroDocumento: "",
                fechaNacimiento: "",
              });
              setModalOpen(true);
            }}
            className="button button-primary"
          >
            + Nuevo Usuario
          </button>
        </div>

        <TableToolbar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          placeholder="Buscar por nombres, apellidos o correo..."
          filters={[
            {
              name: "rolId",
              label: "Todos los roles",
              value: filters.rolId,
              options: opcionesRoles().map(r => ({ value: String(r.value), label: r.label })),
            },
          ]}
          onFilterChange={handleFilterChange}
          sortOptions={sortOptions}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />

        <div className="usuarios-table-wrapper">
          <div className="bg-white rounded-lg shadow-sm">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando usuarios...</p>
              </div>
            ) : (
              <>
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
                              <span className="font-medium">
                                {usuario.nombres}
                              </span>
                            </td>
                            <td>{usuario.apellidos || "-"}</td>
                            <td>{usuario.correo}</td>
                            <td>
                              <span
                                className={`badge ${getRolColor(usuario.rol?.id)}`}
                              >
                                {getRolNombre(usuario.rol?.id)}
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
                              className={`mobile-badge ${getRolColor(usuario.rol?.id)}`}
                            >
                              {getRolNombre(usuario.rol?.id).toUpperCase()}
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
                    <div className="mobile-empty">
                      No hay usuarios disponibles
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
              totalItems={pagination?.totalRegistros || usuarios.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
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
              <PasswordInput
                value={formData.contrasena}
                onChange={(e) =>
                  setFormData({ ...formData, contrasena: e.target.value })
                }
                placeholder="Contraseña"
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
              {opcionesRoles().map(r => (
                <option key={r.value} value={String(r.value)}>{r.label}</option>
              ))}
            </select>
          </div>

          {rolSeleccionado === 2 && (
            <UsuariosConductor
              formData={formData}
              onChange={handleFieldChange}
              vehiculos={vehiculos}
            />
          )}

          {rolSeleccionado === 4 && (
            <UsuariosEntidad formData={formData} onChange={handleFieldChange} />
          )}

          {rolSeleccionado === 3 && (
            <UsuariosPasajero
              formData={formData}
              onChange={handleFieldChange}
            />
          )}

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
