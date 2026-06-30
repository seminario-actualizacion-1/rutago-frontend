import { useState } from "react";
import "./Vehiculos.css";

export default function Vehiculos() {

  const [buscar, setBuscar] = useState("");

  const [vehiculos, setVehiculos] = useState([]);

  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    placa: "",
    empresa: "",
    capacidad: "",
    estado: "Disponible",
  });

  const agregarVehiculo = () => {

    if (
      nuevoVehiculo.placa === "" ||
      nuevoVehiculo.empresa === "" ||
      nuevoVehiculo.capacidad === ""
    ) {
      alert("Complete todos los campos");
      return;
    }

    setVehiculos([...vehiculos, nuevoVehiculo]);

    setNuevoVehiculo({
      placa: "",
      empresa: "",
      capacidad: "",
      estado: "Disponible",
    });

  };

  const resultado = vehiculos.filter((vehiculo) =>
    vehiculo.placa.toLowerCase().includes(buscar.toLowerCase())
  );

  return (
    <div className="vehiculos-container">

      <h1>Gestión de Vehículos</h1>

      <div className="formulario">

        <input
          type="text"
          placeholder="Placa"
          value={nuevoVehiculo.placa}
          onChange={(e) =>
            setNuevoVehiculo({
              ...nuevoVehiculo,
              placa: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Empresa"
          value={nuevoVehiculo.empresa}
          onChange={(e) =>
            setNuevoVehiculo({
              ...nuevoVehiculo,
              empresa: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Capacidad"
          value={nuevoVehiculo.capacidad}
          onChange={(e) =>
            setNuevoVehiculo({
              ...nuevoVehiculo,
              capacidad: e.target.value,
            })
          }
        />

        <select
          value={nuevoVehiculo.estado}
          onChange={(e) =>
            setNuevoVehiculo({
              ...nuevoVehiculo,
              estado: e.target.value,
            })
          }
        >
          <option>Disponible</option>
          <option>En Ruta</option>
          <option>En Terminal</option>
        </select>

        <button
          className="nuevo-btn"
          onClick={agregarVehiculo}
        >
          Registrar Vehículo
        </button>

      </div>

      <input
        type="text"
        placeholder="Buscar por placa..."
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
        className="buscar-input"
      />

      <table>

        <thead>
          <tr>
            <th>Placa</th>
            <th>Empresa</th>
            <th>Capacidad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {resultado.map((vehiculo) => (

            <tr key={vehiculo.placa}>

              <td>{vehiculo.placa}</td>
              <td>{vehiculo.empresa}</td>
              <td>{vehiculo.capacidad}</td>
              <td>{vehiculo.estado}</td>

              <td>

                <button className="editar">
                  Editar
                </button>

                <button className="eliminar">
                  Eliminar
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}