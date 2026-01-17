import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export function RequireUnlocked({ children }) {
  const { isAuthenticated, storageKey } = useAuth();

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Logged in but locked
  if (!storageKey) {
    return <Navigate to="/ok" replace />;
  }

  // Logged in + unlocked
  return children;
}
