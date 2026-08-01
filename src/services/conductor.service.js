import * as api from "../api/conductor";

const extractError = (err, fallback) =>
  new Error(err.response?.data?.message || err.message || fallback);

const normalizePayload = (conductor, isUpdate = false) => {
  const p = { ...conductor };
  if (isUpdate) delete p.usuarioId;
  delete p.vehiculoId;
  if (
    p.usuarioId !== undefined &&
    (p.usuarioId === "" || p.usuarioId == null || Number.isNaN(p.usuarioId))
  )
    p.usuarioId = null;
  else if (p.usuarioId !== undefined) p.usuarioId = Number(p.usuarioId);
  return p;
};

export const conductorService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.getConductores(params);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar conductores");
    }
  },
  getById: async (id) => {
    try {
      const res = await api.getConductorById(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar conductor");
    }
  },
  getMiPerfil: async () => {
    try {
      const res = await api.getMiPerfilConductor();
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar tu perfil de conductor");
    }
  },
  create: async (conductor) => {
    try {
      const res = await api.createConductor(normalizePayload(conductor));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear conductor");
    }
  },
  update: async (id, conductor) => {
    try {
      const res = await api.updateConductor(id, normalizePayload(conductor, true));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar conductor");
    }
  },
  updateMiPerfil: async (conductor) => {
    try {
      const res = await api.updateMiPerfilConductor(normalizePayload(conductor));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar tu perfil de conductor");
    }
  },
  delete: async (id) => {
    try {
      const res = await api.deleteConductor(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al eliminar conductor");
    }
  },
  crearConUsuario: async (data) => {
    try {
      const res = await api.crearConductorConUsuario(data);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear conductor");
    }
  },
};
