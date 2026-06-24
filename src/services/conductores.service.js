const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const conductoresService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/perfiles-conductor`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar conductores");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/perfiles-conductor/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar conductor");
    return response.json();
  },

  create: async (conductor) => {
    const response = await fetch(`${API_URL}/perfiles-conductor`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(conductor),
    });
    if (!response.ok) throw new Error("Error al crear conductor");
    return response.json();
  },

  update: async (id, conductor) => {
    const response = await fetch(`${API_URL}/perfiles-conductor/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(conductor),
    });
    if (!response.ok) throw new Error("Error al actualizar conductor");
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/perfiles-conductor/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al eliminar conductor");
    return response.json();
  },
};