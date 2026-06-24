const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const pasajerosService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/usuarios?rol=3`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar pasajeros");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar pasajero");
    return response.json();
  },

  update: async (id, pasajero) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(pasajero),
    });
    if (!response.ok) throw new Error("Error al actualizar pasajero");
    return response.json();
  },
};