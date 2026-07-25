import * as api from "../api/usuarios";

const extractError = (err, fallback) =>
  new Error(err.response?.data?.message || err.message || fallback);

export const usuariosService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.getUsuarios(params);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar usuarios");
    }
  },
  getById: async (id) => {
    try {
      const res = await api.getUsuarioById(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar usuario");
    }
  },
  create: async (usuario) => {
    try {
      const res = await api.createUsuario(usuario);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear usuario");
    }
  },
  update: async (id, usuario) => {
    try {
      const res = await api.updateUsuario(id, usuario);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar usuario");
    }
  },
  delete: async (id) => {
    try {
      const res = await api.deleteUsuario(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al eliminar usuario");
    }
  },
  changeRole: async (id, rolId) => {
    try {
      const res = await api.changeRol(id, rolId);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cambiar rol");
    }
  },
  solicitarRecuperacion: async (correo) => {
    try {
      const res = await api.solicitarRecuperacion(correo);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al solicitar recuperación");
    }
  },
  verificarToken: async () => {
    try {
      const res = await api.verificarToken();
      return res.data;
    } catch (err) {
      throw extractError(err, "Token inválido o expirado");
    }
  },
};
