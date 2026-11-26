import { Navigate, Outlet, useLocation } from "react-router";
import { useIsAuthenticated } from "@/store/useAuthStore";

/**
 * Layout route guarding its children. Feature routes flagged with
 * `auth: true` are nested under it automatically (see app/router.jsx).
 */
export function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
