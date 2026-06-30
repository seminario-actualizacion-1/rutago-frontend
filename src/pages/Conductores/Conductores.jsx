import { useState } from "react";
import "./Conductores.css";

export default function Conductores() {

  const conductores = [
    {
      nombre: "Juan Pérez",
      documento: "12345678",
      telefono: "3001234567",
      estado: "Activo",
      vehiculo: "ABC123"
    },
    {
      nombre: "María Gómez",
      documento: "87654321",
      telefono: "3019876543",
      estado: "En ruta",
      vehiculo: "DEF456"
    },
    {
      nombre: "Carlos Ruiz",
      documento: "99887766",
      telefono: "3152223344",
      estado: "Inactivo",
      vehiculo: "Sin asignar"
    }
  ];

  const [buscar, setBuscar] = useState("");
  const [estado, setEstado] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [info, setInfo] = useState(null);

  const lista = conductores.filter((c) => {

    const nombre = c.nombre.toLowerCase().includes(buscar.toLowerCase());

    const estadoOk = estado === "" || c.estado === estado;

    const vehiculoOk = vehiculo === "" || c.vehiculo === vehiculo;

    return nombre && estadoOk && vehiculoOk;

  });

  return (
    <div className="conductores">

      <h1>Gestión de Conductores</h1>

      <input
        type="text"
        placeholder="Buscar por nombre"
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
      />

      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      >
        <option value="">Todos los estados</option>
        <option>Activo</option>
        <option>En ruta</option>
        <option>Inactivo</option>
      </select>

      <select
        value={vehiculo}
        onChange={(e) => setVehiculo(e.target.value)}
      >
        <option value="">Todos los vehículos</option>
        <option>ABC123</option>
        <option>DEF456</option>
        <option>Sin asignar</option>
      </select>

      <table>

        <thead>

          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Vehículo</th>
            <th>Acción</th>
          </tr>

        </thead>

        <tbody>

          {lista.map((c, index) => (

            <tr key={index}>

              <td>{c.nombre}</td>

              <td>{c.estado}</td>

              <td>{c.vehiculo}</td>

              <td>

                <button onClick={() => setInfo(c)}>

                  Ver información

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {info && (

        <div className="informacion">

          <h2>Información del conductor</h2>

          <p><b>Nombre:</b> {info.nombre}</p>

          <p><b>Documento:</b> {info.documento}</p>

          <p><b>Teléfono:</b> {info.telefono}</p>

          <p><b>Estado:</b> {info.estado}</p>

          <p><b>Vehículo:</b> {info.vehiculo}</p>

          <button>Asignar vehículo</button>

          <button>Cambiar estado</button>

          <button>Ver historial de viajes</button>

          <button>Ver rutas asignadas</button>

        </div>

      )}

    </div>
  );
}