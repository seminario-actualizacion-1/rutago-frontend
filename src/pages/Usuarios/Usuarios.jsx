import { useState, useEffect } from "react";
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
import { ESTADOS_CONDUCTOR } from "../../config/estados";
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

  const [pagination, setPagination] = useState({
    paginaActual: 1,
    registrosPorPagina: 10,
    totalPaginas: 1,
    totalRegistros: 0,
    tienePaginaAnterior: false,
    tienePaginaSiguiente: false,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ rolId: "" });
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");

  const fetchUsuarios = async (page = currentPage, limit = itemsPerPage, q = searchTerm, flt = filters) => {
    try {
      setLoading(true);
      const params = {
        paginaActual: page,
        registrosPorPagina: limit,
        q: q || undefined,
        sortBy,
        sortOrder,
      };
      
      if (flt.rolId) {
        params.rolId = flt.rolId;
      }
      
      const data = await usuariosService.getAll(params);
      setUsuarios(data.data || []);
      setPagination(
        data.paginacion || {
          paginaActual: page,
          registrosPorPagina: limit,
          totalPaginas: 1,
          totalRegistros: data.data?.length || 0,
          tienePaginaAnterior: false,
          tienePaginaSiguiente: false,
        },
      );
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
      await Promise.all([
        fetchUsuarios(currentPage, itemsPerPage, searchTerm, filters),
        fetchVehiculos(),
      ]);
    };

    loadData();
  }, [currentPage, itemsPerPage, searchTerm, filters, sortBy, sortOrder]);

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
        contrasena: "",
        rolId: Number(usuarioEditando.rol?.id),
        licenciaConducir:
          usuarioEditando.perfilConductor?.licenciaConducir || "",
        vehiculoId:
          usuarioEditando.perfilConductor?.vehiculo?.id != null
            ? Number(usuarioEditando.perfilConductor.vehiculo.id)
            : "",
        estadoConductor:
          usuarioEditando.perfilConductor?.estadoId || 1,
        razonSocial: usuarioEditando.perfilEntidad?.razonSocial || "",
        nit: usuarioEditando.perfilEntidad?.nit || "",
        telefonoContacto: usuarioEditando.perfilEntidad?.telefonoContacto || "",
        telefono: usuarioEditando.perfilPasajero?.telefono || "",
        direccion: usuarioEditando.perfilPasajero?.direccion || "",
        tipoDocumentoId: usuarioEditando.perfilPasajero?.tipoDocumento?.id?.toString() || "",
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

      if (rolId !== 2 && editingUsuario?.perfilConductor) {
        await perfilConductorService.delete(editingUsuario.perfilConductor.id);
      }

      if (rolId !== 4 && editingUsuario?.perfilEntidad) {
        await perfilEntidadService.delete(editingUsuario.perfilEntidad.id);
      }

      if (rolId !== 3 && editingUsuario?.perfilPasajero) {
        await perfilPasajeroService.delete(editingUsuario.perfilPasajero.id);
      }

      // Guardar perfil adicional según rol
      if (rolId === 2) {
        const perfilConductorData = {
          usuarioId,
          vehiculoId: formData.vehiculoId || null,
          licenciaConducir: formData.licenciaConducir,
          estadoId: formData.estadoConductor,
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
      } else if (rolId === 3) {
        const perfilPasajeroData = {
          usuarioId,
          telefono: formData.telefono,
          direccion: formData.direccion,
          tipoDocumentoId: formData.tipoDocumentoId,
          numeroDocumento: formData.numeroDocumento,
          fechaNacimiento: formData.fechaNacimiento || null,
        };

        if (editingUsuario && editingUsuario.perfilPasajero) {
          await perfilPasajeroService.update(
            editingUsuario.perfilPasajero.id,
            perfilPasajeroData,
          );
        } else {
          await perfilPasajeroService.create(perfilPasajeroData);
        }
      }

      setCurrentPage(1);
      await fetchUsuarios(1, itemsPerPage, searchTerm, filters);
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
      await fetchUsuarios(1, itemsPerPage, searchTerm, filters);
    } catch (err) {
      setError(err.message);
    }
  };

  const rolSeleccionado = Number(formData.rolId);

  const usuariosPaginados = usuarios;

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

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "nombres", label: "Nombres" },
    { value: "apellidos", label: "Apellidos" },
    { value: "correo", label: "Correo" },
    { value: "rolId", label: "Rol" }
  ];

  if (loading)
    return (
      <div className="usuarios-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );

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
            options: [
              { value: "1", label: "Administrador" },
              { value: "2", label: "Conductor" },
              { value: "3", label: "Pasajero" },
              { value: "4", label: "Entidad Externa" },
            ],
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
                        <span className={`badge ${getRolColor(usuario.rol?.id)}`}>
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
              <div className="mobile-empty">No hay usuarios disponibles</div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPaginas || 1}
          totalItems={pagination.totalRegistros || usuarios.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(n) => {
            setItemsPerPage(n);
            setCurrentPage(1);
          }}
        />
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Contraseña
              </label>
              <PasswordInput
                value={formData.contrasena}
                onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
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
                      estadoConductor: parseInt(e.target.value),
                    })
                  }
                  className="input"
                  style={{ width: "100%" }}
                >
                  <option value="1">Disponible</option>
                  <option value="2">En viaje</option>
                  <option value="3">Inactivo</option>
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

          {rolSeleccionado === 3 && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="input"
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Dirección</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="input"
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Tipo de Documento</label>
                <select
                  value={formData.tipoDocumentoId}
                  onChange={(e) => setFormData({ ...formData, tipoDocumentoId: parseInt(e.target.value) || "" })}
                  className="input"
                  style={{ width: "100%" }}
                >
                  <option value="">Seleccionar</option>
                  <option value="1">Cédula de Ciudadanía</option>
                  <option value="2">Tarjeta de Identidad</option>
                  <option value="3">Cédula de Extranjería</option>
                  <option value="4">NIT</option>
                  <option value="5">Pasaporte</option>
                </select>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Número de Documento</label>
                <input
                  type="text"
                  value={formData.numeroDocumento}
                  onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                  className="input"
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                  className="input"
                  style={{ width: "100%" }}
                />
              </div>
            </>
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
