import "./ActionsMenu.css";

export default function ActionsMenu({
  onView,
  onEdit,
  onDelete,
  deleteLabel = "Eliminar",
}) {
  const handleChange = (event) => {
    const value = event.target.value;
    event.target.value = "";

    if (value === "ver") { onView?.(); return; }
    if (value === "editar") { onEdit?.(); return; }
    if (value === "eliminar") { onDelete?.(); return; }
  };

  return (
    <select
      className="actions-menu-select"
      defaultValue=""
      onChange={handleChange}
    >
      <option value="" disabled>
        Acciones
      </option>
      {onView && <option value="ver">Ver detalle</option>}
      {onEdit && <option value="editar">Editar</option>}
      {onDelete && <option value="eliminar">{deleteLabel}</option>}
    </select>
  );
}
