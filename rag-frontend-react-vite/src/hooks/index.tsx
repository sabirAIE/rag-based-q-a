import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";

export function ProtectedRoute({ element }: { element: JSX.Element }) {
  const { logedIn } = useAuth();
  return logedIn ? element : <Navigate to="/login" replace />;
}
