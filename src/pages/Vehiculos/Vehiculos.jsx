import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import { vehiculosService } from "../../services/vehiculos.service";
import "./Vehiculos.css";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState(null);
  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    modelo: "",
    color: "",
    capacidadPasajeros: "",
    entidadId: "",
    estado: "EN_TERMINAL",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchVehiculos = async () => {
    try {
      const data = await vehiculosService.getAll();
      setVehiculos(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const handleEditar = (vehiculo) => {
    setEditingVehiculo(vehiculo);
    setFormData({
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      color: vehiculo.color,
      capacidadPasajeros: vehiculo.capacidadPasajeros,
      entidadId: vehiculo.entidadId,
      estado: vehiculo.estado,
    });
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      if (editingVehiculo) {
        await vehiculosService.update(editingVehiculo.id, formData);
      } else {
        await vehiculosService.create(formData);
      }
      await fetchVehiculos();
      setModalOpen(false);
      setEditingVehiculo(null);
      setFormData({
        placa: "",
        marca: "",
        modelo: "",
        color: "",
        capacidadPasajeros: "",
        entidadId: "",
        estado: "EN_TERMINAL",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setEditingVehiculo(null);
    setFormData({
      placa: "",
      marca: "",
      modelo: "",
      color: "",
      capacidadPasajeros: "",
      entidadId: "",
      estado: "EN_TERMINAL",
    });
  };

  const getEstadoColor = (estado) => {
    const colors = {
      "EN_TERMINAL": "badge-en-terminal",
      "EN_RUTA": "badge-en-ruta",
      "PROXIMO": "badge-proximo",
    };
    return colors[estado] || "badge-default";
  };

  // Pagination logic
  const totalPages = Math.ceil(vehiculos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const vehiculosPaginados = vehiculos.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading) return (
    <div className="vehiculos-container">
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando vehículos...</p>
      </div>
    </div>
  );
  
  if (error) return <div className="vehiculos-container"><p className="error">{error}</p></div>;

  return (
    <div className="vehiculos-container">
      <div className="page-header">
        <h1>Gestión de Vehículos</h1>
      </div>

      <div className="table-container">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Desktop Table */}
          <div className="desktop-table">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Placa</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Color</th>
                  <th>Capacidad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculosPaginados.length > 0 ? (
                  vehiculosPaginados.map((vehiculo) => (
                    <tr key={vehiculo.id}>
                      <td>{vehiculo.id}</td>
                      <td><span className="font-medium">{vehiculo.placa}</span></td>
                      <td>{vehiculo.marca}</td>
                      <td>{vehiculo.modelo}</td>
                      <td>{vehiculo.color}</td>
                      <td>{vehiculo.capacidadPasajeros}</td>
                      <td><span className={`badge ${getEstadoColor(vehiculo.estado)}`}>{vehiculo.estado}</span></td>
                      <td>
                        <button onClick={() => handleEditar(vehiculo)} className="button button-primary">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No se encontraron vehículos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {vehiculosPaginados.length > 0 ? (
              <div className="mobile-cards-list">
                {vehiculosPaginados.map((vehiculo) => (
                  <div key={vehiculo.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-info">
                        <h3>{vehiculo.placa}</h3>
                        <p>{vehiculo.marca} {vehiculo.modelo}</p>
                        <p>Color: {vehiculo.color}</p>
                      </div>
                      <span className={`mobile-badge ${getEstadoColor(vehiculo.estado)}`}>
                        {vehiculo.estado}
                      </span>
                    </div>

                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <span>Capacidad</span>
                        <span>{vehiculo.capacidadPasajeros}</span>
                      </div>
                    </div>

                    <div className="mobile-card-actions">
                      <button onClick={() => handleEditar(vehiculo)} className="mobile-button mobile-button-edit">
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mobile-empty">No hay vehículos disponibles</div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={vehiculos.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={editingVehiculo ? "Editar Vehículo" : "Nuevo Vehículo"}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleGuardar(); }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Placa
            </label>
            <input
              type="text"
              value={formData.placa}
              onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Marca
            </label>
            <input
              type="text"
              value={formData.marca}
              onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Modelo
            </label>
            <input
              type="text"
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Color
            </label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Capacidad de Pasajeros
            </label>
            <input
              type="number"
              value={formData.capacidadPasajeros}
              onChange={(e) => setFormData({ ...formData, capacidadPasajeros: parseInt(e.target.value) })}
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Estado
            </label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="input"
              style={{ width: "100%" }}
              required
            >
              <option value="EN_TERMINAL">En Terminal</option>
              <option value="EN_RUTA">En Ruta</option>
              <option value="PROXIMO">Próximo</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button type="button" onClick={handleCerrarModal} className="button button-outline">
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

