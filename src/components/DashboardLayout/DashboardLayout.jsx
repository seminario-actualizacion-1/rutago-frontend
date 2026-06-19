import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

function getInitialUser() {
  try {
    const stored = localStorage.getItem("rutago_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function DashboardLayout() {
  const user = getInitialUser();
  const rol = user?.rolId ?? 3;

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
      <Sidebar rol={rol} />
      <main style={{ flex: 1, padding: "2rem", background: "#f5f5f5" }}>
        <Outlet />
      </main>
    </div>
  );
}
