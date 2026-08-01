import * as api from "../api/pasajero";

const extractError = (err, fallback) =>
  new Error(err.response?.data?.message || err.message || fallback);

export const pasajeroService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.getPasajeros(params);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar pasajeros");
    }
  },
  getById: async (id) => {
    try {
      const res = await api.getPasajeroById(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar pasajero");
    }
  },
  getByUsuario: async (usuarioId) => {
    try {
      const res = await api.getPasajeroByUsuario(usuarioId);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar pasajero por usuario");
    }
  },
  create: async (data) => {
    try {
      const res = await api.createPasajero(data);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear pasajero");
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.updatePasajero(id, data);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar pasajero");
    }
  },
  delete: async (id) => {
    try {
      const res = await api.deletePasajero(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al eliminar pasajero");
    }
  },
  getMiPerfil: async () => {
    try {
      const res = await api.getMiPerfilPasajero();
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar tu perfil de pasajero");
    }
  },
  updateMiPerfil: async (data) => {
    try {
      const res = await api.updateMiPerfilPasajero(data);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar tu perfil de pasajero");
    }
  },
  crearConUsuario: async (data) => {
    try {
      const res = await api.crearPasajeroConUsuario(data);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear pasajero");
    }
  },
};
