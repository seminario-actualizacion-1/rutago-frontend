import api from "./axios";

export const getRutas = (params) => api.get("/rutas", { params });

export const getRutaById = (id) => api.get(`/rutas/${id}`);

export const createRuta = (data) => api.post("/rutas", data);

export const updateRuta = (id, data) => api.put(`/rutas/${id}`, data);

export const deleteRuta = (id) => api.delete(`/rutas/${id}`);
