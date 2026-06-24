const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const rutasService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/rutas`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar rutas");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/rutas/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar ruta");
    return response.json();
  },

  create: async (ruta) => {
    const response = await fetch(`${API_URL}/rutas`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(ruta),
    });
    if (!response.ok) throw new Error("Error al crear ruta");
    return response.json();
  },

  update: async (id, ruta) => {
    const response = await fetch(`${API_URL}/rutas/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(ruta),
    });
    if (!response.ok) throw new Error("Error al actualizar ruta");
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/rutas/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al eliminar ruta");
    return response.json();
  },
};
