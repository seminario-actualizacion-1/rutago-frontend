import api from "./axios";

export const getViajes = (params) => api.get("/viajes", { params });

export const getViajeById = (id) => api.get(`/viajes/${id}`);

export const getViajesDisponibles = () => api.get("/viajes/disponibles");

export const getMisViajes = (params) =>
  api.get("/viajes/me/mis-viajes", { params });

export const createViaje = (data) => api.post("/viajes", data);

export const updateViaje = (id, data) => api.put(`/viajes/${id}`, data);

export const patchViajeAction = (id, action) =>
  api.patch(`/viajes/${id}/${action}`);

export const getViajesDisponiblesPasajero = () =>
  api.get("/viajes/disponibles-pasajero");

export const unirseAViaje = (id) =>
  api.post(`/viajes/${id}/unirse`);

export const bajarseDeViaje = (id) =>
  api.delete(`/viajes/${id}/bajarse`);

export const deleteViaje = (id) =>
  api.delete(`/viajes/${id}`);
