const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const entidadesService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/perfiles-entidad`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar entidades");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/perfiles-entidad/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar entidad");
    return response.json();
  },

  create: async (entidad) => {
    const response = await fetch(`${API_URL}/perfiles-entidad`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(entidad),
    });
    if (!response.ok) throw new Error("Error al crear entidad");
    return response.json();
  },

  update: async (id, entidad) => {
    const response = await fetch(`${API_URL}/perfiles-entidad/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(entidad),
    });
    if (!response.ok) throw new Error("Error al actualizar entidad");
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/perfiles-entidad/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al eliminar entidad");
    return response.json();
  },
};