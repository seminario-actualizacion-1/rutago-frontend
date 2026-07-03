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

const normalizeEntidadPayload = (entidad) => ({
  ...entidad,
  usuarioId:
    entidad.usuarioId === "" ||
    entidad.usuarioId == null ||
    Number.isNaN(entidad.usuarioId)
      ? null
      : Number(entidad.usuarioId),
});

const normalizeEntidadUpdatePayload = (entidad) => {
  const payload = { ...entidad };
  delete payload.usuarioId;
  return payload;
};

export const entidadesService = {
  getAll: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await fetch(
      `${API_URL}/perfiles-entidad${query ? `?${query}` : ""}`,
      {
        headers: getAuthHeaders(),
      },
    );
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
      body: JSON.stringify(normalizeEntidadUpdatePayload(entidad)),
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
