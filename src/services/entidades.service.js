const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const normalizeEntidadPayload = (entidad) => ({
  ...entidad,
  usuarioId:
    entidad.usuarioId === "" ||
    entidad.usuarioId == null ||
    Number.isNaN(entidad.usuarioId)
      ? null
      : Number(entidad.usuarioId),
});

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
      body: JSON.stringify(normalizeEntidadPayload(entidad)),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al crear entidad");
    }
    return response.json();
  },

  update: async (id, entidad) => {
    const response = await fetch(`${API_URL}/perfiles-entidad/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(normalizeEntidadPayload(entidad)),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al actualizar entidad");
    }
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/perfiles-entidad/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al eliminar entidad");
    }
    return response.json();
  },
};
