import api from "./axios";

export const getPasajeros = (params) =>
  api.get("/perfiles-pasajero", { params });

export const getPasajeroById = (id) => api.get(`/perfiles-pasajero/${id}`);

export const getPasajeroByUsuario = (usuarioId) =>
  api.get(`/perfiles-pasajero/usuario/${usuarioId}`);

export const getMiPerfilPasajero = () =>
  api.get("/perfiles-pasajero/me/perfil");

export const updateMiPerfilPasajero = (data) =>
  api.put("/perfiles-pasajero/me/perfil", data);

export const createPasajero = (data) => api.post("/perfiles-pasajero", data);

export const updatePasajero = (id, data) =>
  api.put(`/perfiles-pasajero/${id}`, data);

export const deletePasajero = (id) => api.delete(`/perfiles-pasajero/${id}`);

export const crearPasajeroConUsuario = (data) =>
  api.post("/perfiles-pasajero/crear-usuario", data);
