import { useState, useEffect } from "react";
import { usePaginacion } from "../../hooks/usePaginacion";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import { perfilEntidadService } from "../../services/perfilEntidad.service";
import { usuariosService } from "../../services/usuarios.service";
import "./Entidades.css";

const emptyForm = {
  // Datos del usuario (solo para creación / edición de nombre-apellido-correo)
  nombres: "",
  apellidos: "",
  correo: "",
  contrasena: "",
  // Datos del perfil de entidad
  razonSocial: "",
  nit: "",
  telefonoContacto: "",
};

export default function Entidades() {
  const [entidades, setEntidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntidad, setEditingEntidad] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
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

  const fetchEntidades = async () => {
    try {
      setLoading(true);
      const data = await perfilEntidadService.getAll({
        ...queryParams,
        q: searchTerm || undefined,
        sortBy,
        sortOrder,
      });
      setEntidades(data.data || []);
      actualizarPaginacion(data.paginacion);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntidades();
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    refreshKey,
    sortBy,
    sortOrder,
    queryParams.paginaActual,
    queryParams.registrosPorPagina,
  ]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleNueva = () => {
    setEditingEntidad(null);
    setFormData(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const handleEditar = (entidad) => {
    setEditingEntidad(entidad);
    setFormData({
      nombres: entidad.usuario?.nombres || "",
      apellidos: entidad.usuario?.apellidos || "",
      correo: entidad.usuario?.correo || "",
      razonSocial: entidad.razonSocial || "",
      nit: entidad.nit || "",
      telefonoContacto: entidad.telefonoContacto || "",
    });
    setError("");
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    setSaving(true);
    setError("");
    try {
      if (editingEntidad) {
        // ── EDITAR ──────────────────────────────────────────────────
        const usuarioIdEdicion = editingEntidad.usuario?.id ?? null;

        // 1. Actualizar datos del usuario solo si existe la asociación
        if (usuarioIdEdicion) {
          await usuariosService.update(usuarioIdEdicion, {
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            correo: formData.correo,
          });
        }

        // 2. Actualizar perfil de entidad
        await perfilEntidadService.update(editingEntidad.id, {
          razonSocial: formData.razonSocial,
          nit: formData.nit,
          telefonoContacto: formData.telefonoContacto,
        });
      } else {
        await perfilEntidadService.crearConUsuario({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo: formData.correo,
          contrasena: formData.contrasena,
          razonSocial: formData.razonSocial,
          nit: formData.nit,
          telefonoContacto: formData.telefonoContacto,
        });
      }

      await fetchEntidades();
      setModalOpen(false);
      setEditingEntidad(null);
      setFormData(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta entidad?"))
      return;
    try {
      await perfilEntidadService.delete(id);
      await fetchEntidades();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setEditingEntidad(null);
    setFormData(emptyForm);
    setError("");
  };

  const field = (key) => ({
    value: formData[key],
    onChange: (e) => setFormData({ ...formData, [key]: e.target.value }),
    className: "input",
    style: { width: "100%" },
  });

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "razonSocial", label: "Razón Social" },
    { value: "nit", label: "NIT" },
  ];

  const entidadesPaginadas = entidades;

  return (
    <div className="entidades-container">
      <div className="page-header">
        <h1>Gestión de Entidades</h1>
      </div>

      {error && !modalOpen && <p className="error">{error}</p>}

      <div className="table-container">
        <div className="table-actions" style={{ marginBottom: "1rem" }}>
          <button onClick={handleNueva} className="button button-primary">
            + Nueva Entidad
          </button>
        </div>

        <TableToolbar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          placeholder="Buscar por razón social, NIT, nombres o correo..."
          sortOptions={sortOptions}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />

        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando entidades...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="desktop-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Razón Social</th>
                      <th>NIT</th>
                      <th>Teléfono</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entidadesPaginadas.length > 0 ? (
                      entidadesPaginadas.map((entidad) => (
                        <tr key={entidad.id}>
                          <td>{entidad.id}</td>
                          <td>
                            <span className="font-medium">
                              {entidad.usuario
                                ? `${entidad.usuario.nombres} ${entidad.usuario.apellidos || ""}`
                                : "—"}
                            </span>
                          </td>
                          <td>{entidad.usuario?.correo || "—"}</td>
                          <td>{entidad.razonSocial}</td>
                          <td>{entidad.nit || "—"}</td>
                          <td>{entidad.telefonoContacto || "—"}</td>
                          <td>
                            <ActionsMenu
                              onEdit={() => handleEditar(entidad)}
                              onDelete={() => handleEliminar(entidad.id)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No se encontraron entidades
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="mobile-cards">
                {entidadesPaginadas.length > 0 ? (
                  <div className="mobile-cards-list">
                    {entidadesPaginadas.map((entidad) => (
                      <div key={entidad.id} className="mobile-card">
                        <div className="mobile-card-header">
                          <div className="mobile-card-info">
                            <h3>{entidad.razonSocial}</h3>
                            <p>
                              {entidad.usuario
                                ? `${entidad.usuario.nombres} ${entidad.usuario.apellidos || ""}`
                                : "—"}
                            </p>
                            <p>NIT: {entidad.nit || "—"}</p>
                          </div>
                        </div>
                        <div className="mobile-card-body">
                          <div className="mobile-card-row">
                            <span>Correo</span>
                            <span>{entidad.usuario?.correo || "—"}</span>
                          </div>
                          <div className="mobile-card-row">
                            <span>Teléfono</span>
                            <span>{entidad.telefonoContacto || "—"}</span>
                          </div>
                        </div>
                        <div className="mobile-card-actions">
                          <ActionsMenu
                            onEdit={() => handleEditar(entidad)}
                            onDelete={() => handleEliminar(entidad.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mobile-empty">
                    No hay entidades disponibles
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
            totalItems={pagination?.totalRegistros || entidades.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      {/* ── MODAL ── */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={editingEntidad ? "Editar Entidad" : "Nueva Entidad"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGuardar();
          }}
        >
          {/* Error dentro del modal */}
          {error && (
            <p
              style={{
                color: "#ef4444",
                marginBottom: "1rem",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </p>
          )}

          {/* ── Sección: Datos del usuario ── */}
          <p
            style={{
              fontWeight: "600",
              marginBottom: "0.75rem",
              color: "#374151",
            }}
          >
            Datos del usuario
          </p>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Nombres *
            </label>
            <input type="text" {...field("nombres")} required />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Apellidos *
            </label>
            <input type="text" {...field("apellidos")} required />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Correo *
            </label>
            <input type="email" {...field("correo")} required />
          </div>

          {/* Contraseña solo al crear */}
          {!editingEntidad && (
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Contraseña *
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

          {/* ── Sección: Perfil de entidad ── */}
          <p
            style={{
              fontWeight: "600",
              margin: "0.5rem 0 0.75rem",
              color: "#374151",
            }}
          >
            Datos de la entidad
          </p>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Razón Social *
            </label>
            <input type="text" {...field("razonSocial")} required />
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
            <input type="text" {...field("nit")} />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Teléfono de contacto
            </label>
            <input type="text" {...field("telefonoContacto")} />
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
            <button
              type="submit"
              className="button button-primary"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
