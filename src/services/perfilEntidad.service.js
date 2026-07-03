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

export const perfilEntidadService = {
  getAll: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await fetch(
      `${API_URL}/perfiles-entidad${query ? `?${query}` : ""}`,
      {
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) throw new Error("Error al cargar perfiles de entidad");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/perfiles-entidad/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar perfil de entidad");
    return response.json();
  },

  getByUsuarioId: async (usuarioId) => {
    const response = await fetch(
      `${API_URL}/perfiles-entidad/usuario/${usuarioId}`,
      {
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) throw new Error("Error al cargar perfil de entidad");
    return response.json();
  },

  getMiPerfil: async () => {
    const response = await fetch(`${API_URL}/perfiles-entidad/me/perfil`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || "Error al cargar perfil de entidad",
      );
    }
    return response.json();
  },

  create: async (perfil) => {
    const response = await fetch(`${API_URL}/perfiles-entidad`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(perfil),
    });
    if (!response.ok) throw new Error("Error al crear perfil de entidad");
    return response.json();
  },

  update: async (id, perfil) => {
    const response = await fetch(`${API_URL}/perfiles-entidad/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(perfil),
    });
    if (!response.ok) throw new Error("Error al actualizar perfil de entidad");
    return response.json();
  },

  updateMiPerfil: async (perfil) => {
    const response = await fetch(`${API_URL}/perfiles-entidad/me/perfil`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(perfil),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || "Error al actualizar perfil de entidad",
      );
    }
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/perfiles-entidad/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al eliminar perfil de entidad");
    return response.json();
  },
};
