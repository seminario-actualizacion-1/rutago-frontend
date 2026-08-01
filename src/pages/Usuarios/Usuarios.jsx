import { useState, useEffect } from "react";
import { useRoles } from "../../hooks/useRoles";
import { usePaginacion } from "../../hooks/usePaginacion";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import { usuariosService } from "../../services/usuarios.service";
import { conductorService } from "../../services/conductor.service";
import { entidadService } from "../../services/entidad.service";
import { pasajeroService } from "../../services/pasajero.service";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import UsuariosConductor from "./UsuariosConductor";
import UsuariosPasajero from "./UsuariosPasajero";
import UsuariosEntidad from "./UsuariosEntidad";
import "./Usuarios.css";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
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

  useEffect(() => {
    const loadData = async () => {
      await fetchUsuarios();
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

      let conductor = usuarioCompleto.conductor || null;
      let entidad = usuarioCompleto.entidad || null;

      if (usuarioCompleto.rol?.id === 2 && conductor?.id) {
        const conductorResponse = await conductorService.getById(
          conductor.id,
        );
        conductor = conductorResponse.data || conductor;
      }

      if (usuarioCompleto.rol?.id === 4 && entidad?.id) {
        const entidadResponse = await entidadService.getById(
          entidad.id,
        );
        entidad = entidadResponse.data || entidad;
      }

      const usuarioEditando = {
        ...usuarioCompleto,
        conductor,
        entidad,
      };

      const nuevoFormData = {
        nombres: usuarioEditando.nombres,
        apellidos: usuarioEditando.apellidos || "",
        correo: usuarioEditando.correo,
        rolId: Number(usuarioEditando.rol?.id),
        licenciaConducir:
          usuarioEditando.conductor?.licenciaConducir || "",
        estadoConductor: usuarioEditando.conductor?.estadoId || 1,
        razonSocial: usuarioEditando.entidad?.razonSocial || "",
        nit: usuarioEditando.entidad?.nit || "",
        telefonoContacto: usuarioEditando.entidad?.telefonoContacto || "",
        telefono: usuarioEditando.pasajero?.telefono || "",
        direccion: usuarioEditando.pasajero?.direccion || "",
        tipoDocumentoId:
          usuarioEditando.pasajero?.tipoDocumento?.id?.toString() || "",
        numeroDocumento: usuarioEditando.pasajero?.numeroDocumento || "",
        fechaNacimiento: usuarioEditando.pasajero?.fechaNacimiento
          ? usuarioEditando.pasajero.fechaNacimiento.split("T")[0]
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
        const res = await conductorService.crearConUsuario({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo: formData.correo,
          contrasena: formData.contrasena,
          licenciaConducir: formData.licenciaConducir,
          estadoId: formData.estadoConductor,
        });
        usuarioId = res.data?.usuario?.id;
      } else if (rolId === 4) {
        const res = await entidadService.crearConUsuario({
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
        const res = await pasajeroService.crearConUsuario({
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
        if (rolId !== 2 && editingUsuario.conductor) {
          await conductorService.delete(
            editingUsuario.conductor.id,
          );
        }
        if (rolId !== 4 && editingUsuario.entidad) {
          await entidadService.delete(editingUsuario.entidad.id);
        }
        if (rolId !== 3 && editingUsuario.pasajero) {
          await pasajeroService.delete(editingUsuario.pasajero.id);
        }

        // Guardar perfil adicional según rol (solo edición)
        if (rolId === 2 && editingUsuario.conductor) {
          await conductorService.update(
            editingUsuario.conductor.id,
            {
              usuarioId,
              licenciaConducir: formData.licenciaConducir,
              estadoId: formData.estadoConductor,
            },
          );
        } else if (rolId === 4 && editingUsuario.entidad) {
          await entidadService.update(editingUsuario.entidad.id, {
            usuarioId,
            razonSocial: formData.razonSocial,
            nit: formData.nit,
            telefonoContacto: formData.telefonoContacto,
          });
        } else if (rolId === 3 && editingUsuario.pasajero) {
          await pasajeroService.update(editingUsuario.pasajero.id, {
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
      if (usuario.conductor) {
        await conductorService.delete(usuario.conductor.id);
      }

      if (usuario.entidad) {
        await entidadService.delete(usuario.entidad.id);
      }

      if (usuario.pasajero) {
        await pasajeroService.delete(usuario.pasajero.id);
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
