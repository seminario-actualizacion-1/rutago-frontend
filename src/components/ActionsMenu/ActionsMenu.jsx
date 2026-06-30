import "./ActionsMenu.css";

export default function ActionsMenu({
  onEdit,
  onDelete,
  deleteLabel = "Eliminar",
}) {
  const handleChange = (event) => {
    const value = event.target.value;

    if (value === "editar") {
      onEdit?.();
    }

    if (value === "eliminar") {
      onDelete?.();
    }

    event.target.value = "";
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
      <option value="editar">Editar</option>
      {onDelete && <option value="eliminar">{deleteLabel}</option>}
    </select>
  );
}
