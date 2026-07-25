import * as api from "../api/viajes";

const extractError = (err, fallback) =>
  new Error(err.response?.data?.message || err.message || fallback);

export const viajesService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.getViajes(params);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar viajes");
    }
  },
  getDisponibles: async () => {
    try {
      const res = await api.getViajesDisponibles();
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar viajes disponibles");
    }
  },
  getById: async (id) => {
    try {
      const res = await api.getViajeById(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar viaje");
    }
  },
  getMisViajes: async (params = {}) => {
    try {
      const res = await api.getMisViajes(params);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar tus viajes");
    }
  },
  create: async (data) => {
    try {
      const res = await api.createViaje(data);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear viaje");
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.updateViaje(id, data);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar viaje");
    }
  },
  patchAction: async (id, action) => {
    try {
      const res = await api.patchViajeAction(id, action);
      return res.data;
    } catch (err) {
      throw extractError(err, `Error al ${action} viaje`);
    }
  },
  obtenerDisponiblesPasajero: async () => {
    try {
      const res = await api.getViajesDisponiblesPasajero();
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar viajes disponibles");
    }
  },
  unirse: async (id) => {
    try {
      const res = await api.unirseAViaje(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al unirse al viaje");
    }
  },
  bajarse: async (id) => {
    try {
      const res = await api.bajarseDeViaje(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al retirarse del viaje");
    }
  },
  eliminar: async (id) => {
    try {
      const res = await api.deleteViaje(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al eliminar viaje");
    }
  },
};
