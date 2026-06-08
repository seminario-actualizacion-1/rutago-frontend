import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Registro from "./pages/Registro/Registro";
import RecuperarPassword from "./pages/RecuperarPassword/RecuperarPassword";
import Home from "./pages/Home/Home"; // Usando Home como acordamos

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
