import * as api from "../api/vehiculos";

const extractError = (err, fallback) =>
  new Error(err.response?.data?.message || err.message || fallback);

export const vehiculosService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.getVehiculos(params);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar vehículos");
    }
  },
  getById: async (id) => {
    try {
      const res = await api.getVehiculoById(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar vehículo");
    }
  },
  create: async (vehiculo) => {
    try {
      const res = await api.createVehiculo(vehiculo);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear vehículo");
    }
  },
  update: async (id, vehiculo) => {
    try {
      const res = await api.updateVehiculo(id, vehiculo);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar vehículo");
    }
  },
  delete: async (id) => {
    try {
      const res = await api.deleteVehiculo(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al eliminar vehículo");
    }
  },
};
