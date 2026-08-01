import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import { pasajeroService } from "../../services/pasajero.service";
import { usuariosService } from "../../services/usuarios.service";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import { usePaginacion } from "../../hooks/usePaginacion";
import { useTiposDocumento } from "../../hooks/useTiposDocumento";
import "./Pasajeros.css";

const emptyForm = {
  nombres: "",
  apellidos: "",
  correo: "",
  contrasena: "",
  telefono: "",
  direccion: "",
  tipoDocumentoId: "",
  numeroDocumento: "",
  fechaNacimiento: "",
};

export default function Pasajeros() {
  const [pasajeros, setPasajeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPasajero, setEditingPasajero] = useState(null);
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

  const { opciones: opcionesTiposDocumento } = useTiposDocumento();

  const handleNuevo = () => {
    setEditingPasajero(null);
    setFormData(emptyForm);
    setError("");
    setModalOpen(true);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");

  const fetchPasajeros = async () => {
    try {
      setLoading(true);
      const data = await pasajeroService.getAll({
        ...queryParams,
        q: searchTerm || undefined,
        sortBy,
        sortOrder,
      });
      setPasajeros(data.data || []);
      actualizarPaginacion(data.paginacion);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasajeros();
  }, [queryParams, searchTerm, sortBy, sortOrder]);

  const handleEditar = (pasajero) => {
    setError("");
    setEditingPasajero(pasajero);
    const u = pasajero.usuario || {};
    setFormData({
      nombres: u.nombres || "",
      apellidos: u.apellidos || "",
      correo: u.correo || "",
      telefono: pasajero.telefono || "",
      direccion: pasajero.direccion || "",
      tipoDocumentoId: pasajero.tipoDocumento?.id?.toString() || "",
      numeroDocumento: pasajero.numeroDocumento || "",
      fechaNacimiento: pasajero.fechaNacimiento
        ? pasajero.fechaNacimiento.slice(0, 10)
        : "",
    });
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      if (editingPasajero) {
        await pasajeroService.update(editingPasajero.id, {
          telefono: formData.telefono,
          direccion: formData.direccion,
          tipoDocumentoId: formData.tipoDocumentoId,
          numeroDocumento: formData.numeroDocumento,
          fechaNacimiento: formData.fechaNacimiento || null,
        });
        if (editingPasajero.usuario) {
          await usuariosService.update(editingPasajero.usuario.id, {
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            correo: formData.correo,
          });
        }
      } else {
        await pasajeroService.crearConUsuario({
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
      }
      setError("");
      await fetchPasajeros();
      setModalOpen(false);
      setEditingPasajero(null);
      setFormData(emptyForm);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "telefono", label: "Teléfono" },
    { value: "numeroDocumento", label: "Documento" },
  ];

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleCerrarModal = () => {
    setError("");
    setModalOpen(false);
    setEditingPasajero(null);
    setFormData(emptyForm);
  };

  const handleEliminar = async (id) => {
    if (
      !window.confirm("¿Estás seguro de que deseas eliminar este pasajero?")
    ) {
      return;
    }

    try {
      await pasajeroService.delete(id);
      await fetchPasajeros();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="pasajeros-container">
      <div className="page-header">
        <h1>Gestión de Pasajeros</h1>
      </div>
      {error && !modalOpen && <p className="error">{error}</p>}

      <div className="table-container">
        <div className="table-actions" style={{ marginBottom: "1rem" }}>
          <button onClick={handleNuevo} className="button button-primary">
            + Nuevo Pasajero
          </button>
        </div>

        <TableToolbar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          placeholder="Buscar por nombres, apellidos, correo o documento..."
          sortOptions={sortOptions}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />

        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando pasajeros...</p>
            </div>
          ) : (
            <>
              <div className="desktop-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombres</th>
                      <th>Apellidos</th>
                      <th>Correo</th>
                      <th>Teléfono</th>
                      <th>Documento</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pasajeros.length > 0 ? (
                      pasajeros.map((pasajero) => (
                        <tr key={pasajero.id}>
                          <td>{pasajero.id}</td>
                          <td>
                            <span className="font-medium">
                              {pasajero.usuario?.nombres || "-"}
                            </span>
                          </td>
                          <td>{pasajero.usuario?.apellidos || "-"}</td>
                          <td>{pasajero.usuario?.correo || "-"}</td>
                          <td>{pasajero.telefono || "-"}</td>
                          <td>
                            {pasajero.tipoDocumento?.id &&
                            pasajero.numeroDocumento ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span className="font-medium">
                                  {pasajero.numeroDocumento}
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.7rem",
                                    color: "#6b7280",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {pasajero.tipoDocumento?.nombre ||
                                    pasajero.tipoDocumento?.id}
                                </span>
                              </div>
                            ) : pasajero.numeroDocumento ? (
                              pasajero.numeroDocumento
                            ) : pasajero.tipoDocumento?.id ? (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  color: "#6b7280",
                                  textTransform: "uppercase",
                                }}
                              >
                                {pasajero.tipoDocumento?.nombre ||
                                  pasajero.tipoDocumento?.id}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            <ActionsMenu
                              onEdit={() => handleEditar(pasajero)}
                              onDelete={() => handleEliminar(pasajero.id)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No se encontraron pasajeros
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mobile-cards">
                {pasajeros.length > 0 ? (
                  <div className="mobile-cards-list">
                    {pasajeros.map((pasajero) => (
                      <div key={pasajero.id} className="mobile-card">
                        <div className="mobile-card-header">
                          <div className="mobile-card-info">
                            <h3>{pasajero.usuario?.nombres || "Sin nombre"}</h3>
                            <p>{pasajero.usuario?.correo || "Sin correo"}</p>
                          </div>
                        </div>
                        <div className="mobile-card-body">
                          <div className="mobile-card-row">
                            <span>Teléfono</span>
                            <span>{pasajero.telefono || "-"}</span>
                          </div>
                          <div className="mobile-card-row">
                            <span>Documento</span>
                            <span>
                              {pasajero.tipoDocumento?.id
                                ? `${pasajero.tipoDocumento?.nombre || pasajero.tipoDocumento?.id} ${pasajero.numeroDocumento || ""}`
                                : "-"}
                            </span>
                          </div>
                        </div>
                        <div className="mobile-card-actions">
                          <ActionsMenu
                            onEdit={() => handleEditar(pasajero)}
                            onDelete={() => handleEliminar(pasajero.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mobile-empty">
                    No hay pasajeros disponibles
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
            totalItems={pagination?.totalRegistros || pasajeros.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={editingPasajero ? "Editar Pasajero" : "Nuevo Pasajero"}
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
          {!editingPasajero && (
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
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Teléfono
            </label>
            <input
              type="text"
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
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
              Dirección
            </label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) =>
                setFormData({ ...formData, direccion: e.target.value })
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
              Tipo Documento
            </label>
            <select
              value={formData.tipoDocumentoId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tipoDocumentoId: parseInt(e.target.value) || "",
                })
              }
              className="input"
              style={{ width: "100%" }}
            >
              <option value="">Seleccionar</option>
              {opcionesTiposDocumento().map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
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
              Número Documento
            </label>
            <input
              type="text"
              value={formData.numeroDocumento}
              onChange={(e) =>
                setFormData({ ...formData, numeroDocumento: e.target.value })
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
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) =>
                setFormData({ ...formData, fechaNacimiento: e.target.value })
              }
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
