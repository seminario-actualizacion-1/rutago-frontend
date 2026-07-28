import api from "./axios";

export const getEstadosVehiculo = () => api.get("/estados-vehiculo");

export const getEstadosConductor = () => api.get("/estados-conductor");

export const getEstadosViaje = () => api.get("/estados-viaje");
