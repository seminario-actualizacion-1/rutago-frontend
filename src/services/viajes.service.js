const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const viajesService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/viajes`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar viajes");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/viajes/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar viaje");
    return response.json();
  },

  create: async (viaje) => {
    const response = await fetch(`${API_URL}/viajes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(viaje),
    });
    if (!response.ok) throw new Error("Error al crear viaje");
    return response.json();
  },
};