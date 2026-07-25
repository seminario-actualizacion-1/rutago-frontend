import api from "./axios";

export const getUsuarios = (params) => api.get("/usuarios", { params });

export const getUsuarioById = (id) => api.get(`/usuarios/${id}`);

export const createUsuario = (data) => api.post("/usuarios/registro", data);

export const updateUsuario = (id, data) => api.put(`/usuarios/${id}`, data);

export const deleteUsuario = (id) => api.delete(`/usuarios/${id}`);

export const changeRol = (id, rolId) =>
  api.put(`/usuarios/${id}/rol`, { rolId });

export const solicitarRecuperacion = (correo) =>
  api.post("/usuarios/recuperar-password", { correo });

export const verificarToken = () => api.get("/auth/verificar-token");
