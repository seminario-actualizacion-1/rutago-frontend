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
