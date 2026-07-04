import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function getInitialUser() {
  try {
    const stored = localStorage.getItem("rutago_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const user = getInitialUser();

  if (allowedRoles && user && !allowedRoles.includes(user.rolId)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
