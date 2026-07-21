import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import { perfilPasajeroService } from "../../services/perfilPasajero.service";
import { usuariosService } from "../../services/usuarios.service";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
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
  const [pagination, setPagination] = useState({
    paginaActual: 1,
    registrosPorPagina: 10,
    totalPaginas: 1,
    totalRegistros: 0,
    tienePaginaAnterior: false,
    tienePaginaSiguiente: false,
  });
  const [formData, setFormData] = useState(emptyForm);
  const [currentPage, setCurrentPage] = useState(1);

  const handleNuevo = () => {
    setEditingPasajero(null);
    setFormData(emptyForm);
    setError("");
    setModalOpen(true);
  };
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");

  const fetchPasajeros = async (page = currentPage, limit = itemsPerPage, q = searchTerm) => {
    try {
      setLoading(true);
      const data = await perfilPasajeroService.getAll({
        paginaActual: page,
        registrosPorPagina: limit,
        q: q || undefined,
        sortBy,
        sortOrder,
      });
      setPasajeros(data.data || []);
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

  useEffect(() => {
    fetchPasajeros(currentPage, itemsPerPage, searchTerm);
  }, [currentPage, itemsPerPage, searchTerm, sortBy, sortOrder]);

  const handleEditar = (perfil) => {
    setError("");
    setEditingPasajero(perfil);
    const u = perfil.usuario || {};
    setFormData({
      nombres: u.nombres || "",
      apellidos: u.apellidos || "",
      correo: u.correo || "",
      telefono: perfil.telefono || "",
      direccion: perfil.direccion || "",
      tipoDocumentoId: perfil.tipoDocumento?.id?.toString() || "",
      numeroDocumento: perfil.numeroDocumento || "",
      fechaNacimiento: perfil.fechaNacimiento
        ? perfil.fechaNacimiento.slice(0, 10)
        : "",
    });
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      if (editingPasajero) {
        await perfilPasajeroService.update(editingPasajero.id, {
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
        const usuarioResponse = await usuariosService.create({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo: formData.correo,
          contrasena: formData.contrasena,
          rolId: 3,
        });

        const usuarioId = usuarioResponse.usuario?.id;
        if (!usuarioId)
          throw new Error("No se pudo obtener el ID del usuario creado.");

        await perfilPasajeroService.create({
          usuarioId,
          telefono: formData.telefono,
          direccion: formData.direccion,
          tipoDocumentoId: formData.tipoDocumentoId,
          numeroDocumento: formData.numeroDocumento,
          fechaNacimiento: formData.fechaNacimiento || null,
        });
      }
      setError("");
      setCurrentPage(1);
      await fetchPasajeros(1, itemsPerPage, searchTerm);
      setModalOpen(false);
      setEditingPasajero(null);
      setFormData(emptyForm);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "telefono", label: "Teléfono" },
    { value: "numeroDocumento", label: "Documento" },
  ];

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
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
      await perfilPasajeroService.delete(id);
      setCurrentPage(1);
      await fetchPasajeros(1, itemsPerPage, searchTerm);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="pasajeros-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando pasajeros...</p>
        </div>
      </div>
    );

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
                  pasajeros.map((perfil) => (
                    <tr key={perfil.id}>
                      <td>{perfil.id}</td>
                      <td>
                        <span className="font-medium">{perfil.usuario?.nombres || "-"}</span>
                      </td>
                      <td>{perfil.usuario?.apellidos || "-"}</td>
                      <td>{perfil.usuario?.correo || "-"}</td>
                      <td>{perfil.telefono || "-"}</td>
                      <td>
                        {perfil.tipoDocumento?.id && perfil.numeroDocumento ? (
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span className="font-medium">{perfil.numeroDocumento}</span>
                            <span style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase" }}>
                              {perfil.tipoDocumento?.nombre || perfil.tipoDocumento?.id}
                            </span>
                          </div>
                        ) : perfil.numeroDocumento ? (
                          perfil.numeroDocumento
                        ) : perfil.tipoDocumento?.id ? (
                          <span style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase" }}>
                            {perfil.tipoDocumento?.nombre || perfil.tipoDocumento?.id}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <ActionsMenu
                          onEdit={() => handleEditar(perfil)}
                          onDelete={() => handleEliminar(perfil.id)}
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
                {pasajeros.map((perfil) => (
                  <div key={perfil.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-info">
                        <h3>{perfil.usuario?.nombres || "Sin nombre"}</h3>
                        <p>{perfil.usuario?.correo || "Sin correo"}</p>
                      </div>
                    </div>
                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <span>Teléfono</span>
                        <span>{perfil.telefono || "-"}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span>Documento</span>
                        <span>
                          {perfil.tipoDocumento?.id
                            ? `${perfil.tipoDocumento?.nombre || perfil.tipoDocumento?.id} ${perfil.numeroDocumento || ""}`
                            : "-"}
                        </span>
                      </div>
                    </div>
                    <div className="mobile-card-actions">
                      <ActionsMenu
                        onEdit={() => handleEditar(perfil)}
                        onDelete={() => handleEliminar(perfil.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mobile-empty">No hay pasajeros disponibles</div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPaginas || 1}
          totalItems={pagination.totalRegistros || pasajeros.length}
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
        title={editingPasajero ? "Editar Pasajero" : "Nuevo Pasajero"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGuardar();
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Nombres
            </label>
            <input
              type="text"
              value={formData.nombres}
              onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Apellidos
            </label>
            <input
              type="text"
              value={formData.apellidos}
              onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
              className="input"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Correo
            </label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          {!editingPasajero && (
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
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Teléfono
            </label>
            <input
              type="text"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="input"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Dirección
            </label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="input"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Tipo Documento
            </label>
            <select
              value={formData.tipoDocumentoId}
              onChange={(e) => setFormData({ ...formData, tipoDocumentoId: parseInt(e.target.value) || "" })}
              className="input"
              style={{ width: "100%" }}
            >
              <option value="">Seleccionar</option>
              <option value="1">CC</option>
              <option value="2">TI</option>
              <option value="3">CE</option>
              <option value="4">NIT</option>
              <option value="5">PASAPORTE</option>
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Número Documento
            </label>
            <input
              type="text"
              value={formData.numeroDocumento}
              onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
              className="input"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
              className="input"
              style={{ width: "100%" }}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
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
