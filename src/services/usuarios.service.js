const API_URL = import.meta.env.VITE_API_URL || "/api";

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const usuariosService = {
  // Obtener todos los usuarios
  getAll: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await fetch(
      `${API_URL}/usuarios${query ? `?${query}` : ""}`,
      {
        headers: getAuthHeaders(),
      },
    );
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

  // Crear un nuevo usuario (el backend usa /registro como endpoint de creación)
  create: async (usuario) => {
    const response = await fetch(`${API_URL}/usuarios/registro`, {
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
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ rolId }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al cambiar rol");
    }
    return response.json();
  },

  // Verificar si el token es válido
  verificarToken: async () => {
    const response = await fetch(`${API_URL}/usuarios/verificar-token`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Token inválido o expirado");
    }
    return response.json();
  },
};
