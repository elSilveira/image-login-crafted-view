import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Public routes - these routes are accessible without login
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  // Show loading indicator while checking authentication status
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <div className="text-xl font-semibold text-gray-700">Carregando...</div>
          <div className="mt-2 text-sm text-gray-500">Verificando autenticação...</div>
        </div>
      </div>
    );
  }

  // If authenticated and trying to access public route, redirect to home
  if (isAuthenticated && isPublicRoute) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // In all other cases (authenticated on protected routes, unauthenticated on public routes)
  return <>{children}</>;
};

export default ProtectedRoute;
