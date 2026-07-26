export function obtenerEstadoColor(estadoId) {
  const colors = {
    1: "badge-pendiente",
    2: "badge-aceptado",
    3: "badge-en-curso",
    4: "badge-finalizado",
    5: "badge-cancelado",
  };
  return colors[estadoId] || "badge-default";
}

export function obtenerEstadoId(viaje) {
  return viaje.estado?.id || viaje.estadoId || viaje.estado;
}

export function obtenerNombrePersona(usuario) {
  if (!usuario) return "No asignado";
  return (
    `${usuario.nombres || ""} ${usuario.apellidos || ""}`.trim() ||
    usuario.correo ||
    "No asignado"
  );
}

export function textoCupos(viaje) {
  const ocupados = viaje.pasajeros?.length || 0;
  const capacidad =
    viaje.horario?.vehiculo?.capacidadPasajeros || viaje.capacidad || 0;
  return `${ocupados}/${capacidad}`;
}

export function getInitialUser() {
  try {
    const stored = localStorage.getItem("rutago_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function textoCuposPasajero(viaje) {
  const ocupados = (viaje.pasajeros || []).length;
  const capacidad = viaje.horario?.capacidadPasajeros || 0;
  return `${ocupados}/${capacidad}`;
}

export function horarioLabel(viaje) {
  return viaje.horario?.horaSalida?.slice(0, 5) || "Sin horario";
}
