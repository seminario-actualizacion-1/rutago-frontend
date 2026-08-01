import api from "./axios";

export const getConductores = (params) =>
  api.get("/conductores", { params });

export const getConductorById = (id) => api.get(`/conductores/${id}`);

export const getMiPerfilConductor = () =>
  api.get("/conductores/me/perfil");

export const updateMiPerfilConductor = (data) =>
  api.put("/conductores/me/perfil", data);

export const createConductor = (data) => api.post("/conductores", data);

export const updateConductor = (id, data) =>
  api.put(`/conductores/${id}`, data);

export const deleteConductor = (id) => api.delete(`/conductores/${id}`);

export const crearConductorConUsuario = (data) =>
  api.post("/conductores/crear-usuario", data);
