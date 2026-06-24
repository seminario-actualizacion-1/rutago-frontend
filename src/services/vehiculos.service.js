const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const vehiculosService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/vehiculos`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar vehículos");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/vehiculos/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar vehículo");
    return response.json();
  },

  create: async (vehiculo) => {
    const response = await fetch(`${API_URL}/vehiculos`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(vehiculo),
    });
    if (!response.ok) throw new Error("Error al crear vehículo");
    return response.json();
  },

  update: async (id, vehiculo) => {
    const response = await fetch(`${API_URL}/vehiculos/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(vehiculo),
    });
    if (!response.ok) throw new Error("Error al actualizar vehículo");
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/vehiculos/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al eliminar vehículo");
    return response.json();
  },
};
