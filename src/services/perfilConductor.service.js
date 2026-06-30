const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const normalizePerfilConductorPayload = (perfil) => ({
  ...perfil,
  usuarioId:
    perfil.usuarioId === "" ||
    perfil.usuarioId == null ||
    Number.isNaN(perfil.usuarioId)
      ? null
      : Number(perfil.usuarioId),
  vehiculoId:
    perfil.vehiculoId === "" ||
    perfil.vehiculoId == null ||
    Number.isNaN(perfil.vehiculoId)
      ? null
      : Number(perfil.vehiculoId),
});

export const perfilConductorService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/perfiles-conductor`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar perfiles de conductor");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/perfiles-conductor/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar perfil de conductor");
    return response.json();
  },

  getMiPerfil: async () => {
    const response = await fetch(`${API_URL}/perfiles-conductor/me/perfil`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || "Error al cargar perfil de conductor",
      );
    }
    return response.json();
  },

  create: async (perfil) => {
    const response = await fetch(`${API_URL}/perfiles-conductor`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(normalizePerfilConductorPayload(perfil)),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || "Error al crear perfil de conductor",
      );
    }
    return response.json();
  },

  update: async (id, perfil) => {
    const response = await fetch(`${API_URL}/perfiles-conductor/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(normalizePerfilConductorPayload(perfil)),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || "Error al actualizar perfil de conductor",
      );
    }
    return response.json();
  },

  updateMiPerfil: async (perfil) => {
    const response = await fetch(`${API_URL}/perfiles-conductor/me/perfil`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(normalizePerfilConductorPayload(perfil)),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || "Error al actualizar perfil de conductor",
      );
    }
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/perfiles-conductor/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || "Error al eliminar perfil de conductor",
      );
    }
    return response.json();
  },
};
