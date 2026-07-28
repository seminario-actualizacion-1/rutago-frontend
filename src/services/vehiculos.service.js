import * as api from "../api/vehiculos";

const extractError = (err, fallback) =>
  new Error(err.response?.data?.message || err.message || fallback);

const normalizePayload = (data) => {
  const n = { ...data };
  ["capacidadPasajeros", "entidadId", "estadoId"].forEach((campo) => {
    const val = n[campo];
    if (val === "" || val == null || Number.isNaN(val)) {
      delete n[campo];
    } else {
      n[campo] = Number(val);
    }
  });
  return n;
};

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
      const res = await api.createVehiculo(normalizePayload(vehiculo));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear vehículo");
    }
  },
  update: async (id, vehiculo) => {
    try {
      const res = await api.updateVehiculo(id, normalizePayload(vehiculo));
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
