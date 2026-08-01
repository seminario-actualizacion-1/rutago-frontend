import api from "./axios";

export const getPasajeros = (params) =>
  api.get("/pasajeros", { params });

export const getPasajeroById = (id) => api.get(`/pasajeros/${id}`);

export const getPasajeroByUsuario = (usuarioId) =>
  api.get(`/pasajeros/usuario/${usuarioId}`);

export const getMiPerfilPasajero = () =>
  api.get("/pasajeros/me/perfil");

export const updateMiPerfilPasajero = (data) =>
  api.put("/pasajeros/me/perfil", data);

export const createPasajero = (data) => api.post("/pasajeros", data);

export const updatePasajero = (id, data) =>
  api.put(`/pasajeros/${id}`, data);

export const deletePasajero = (id) => api.delete(`/pasajeros/${id}`);

export const crearPasajeroConUsuario = (data) =>
  api.post("/pasajeros/crear-usuario", data);
