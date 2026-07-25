import api from "./axios";

export const getVehiculos = (params) => api.get("/vehiculos", { params });

export const getVehiculoById = (id) => api.get(`/vehiculos/${id}`);

export const createVehiculo = (data) => api.post("/vehiculos", data);

export const updateVehiculo = (id, data) => api.put(`/vehiculos/${id}`, data);

export const deleteVehiculo = (id) => api.delete(`/vehiculos/${id}`);
