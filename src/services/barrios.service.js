const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const barriosService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/barrios`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar barrios");
    return response.json();
  },

  getByComuna: async (comunaId) => {
    const response = await fetch(`${API_URL}/barrios/comuna/${comunaId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar barrios por comuna");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/barrios/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar barrio");
    return response.json();
  },

  create: async (barrio) => {
    const response = await fetch(`${API_URL}/barrios`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(barrio),
    });
    if (!response.ok) throw new Error("Error al crear barrio");
    return response.json();
  },

  update: async (id, barrio) => {
    const response = await fetch(`${API_URL}/barrios/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(barrio),
    });
    if (!response.ok) throw new Error("Error al actualizar barrio");
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/barrios/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al eliminar barrio");
    return response.json();
  },
};
