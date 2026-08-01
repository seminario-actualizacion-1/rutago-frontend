export function formatearHora(hora) {
  if (!hora) return "";
  const [h, m] = hora.slice(0, 5).split(":");
  const horas = parseInt(h, 10);
  if (isNaN(horas)) return hora;
  const sufijo = horas >= 12 ? "PM" : "AM";
  const hora12 = horas % 12 || 12;
  return `${hora12}:${m} ${sufijo}`;
}
