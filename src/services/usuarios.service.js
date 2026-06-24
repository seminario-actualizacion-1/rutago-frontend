const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const usuariosService = {
  // Obtener todos los usuarios
  getAll: async () => {
    const response = await fetch(`${API_URL}/usuarios`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar usuarios");
    return response.json();
  },

  // Obtener un usuario por ID
  getById: async (id) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar usuario");
    return response.json();
  },

  // Crear un nuevo usuario
  create: async (usuario) => {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(usuario),
    });
    if (!response.ok) throw new Error("Error al crear usuario");
    return response.json();
  },

  // Actualizar un usuario
  update: async (id, usuario) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(usuario),
    });
    if (!response.ok) throw new Error("Error al actualizar usuario");
    return response.json();
  },

  // Eliminar un usuario
  delete: async (id) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al eliminar usuario");
    return response.json();
  },

  // Cambiar rol de un usuario
  changeRole: async (id, rolId) => {
    const response = await fetch(`${API_URL}/usuarios/${id}/rol`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ rolId }),
    });
    if (!response.ok) throw new Error("Error al cambiar rol");
    return response.json();
  },
};
