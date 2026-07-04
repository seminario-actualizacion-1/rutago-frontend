export const ROLES = {
  ADMIN: 1,
  CONDUCTOR: 2,
  PASAJERO: 3,
  ENTIDAD: 4,
};

export const NOMBRES_ROL = {
  1: "Administrador",
  2: "Conductor",
  3: "Pasajero",
  4: "Entidad Externa",
};

export function obtenerRol(rolId) {
  return NOMBRES_ROL[rolId] || "Desconocido";
}
