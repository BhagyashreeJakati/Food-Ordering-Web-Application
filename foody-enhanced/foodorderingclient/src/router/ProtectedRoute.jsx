import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { token } = useSelector(state => state.auth);
  // Always also check localStorage — covers page-refresh before Redux hydrates
  const activeToken = token || localStorage.getItem('jwtToken');

  if (!activeToken) {
    return <Navigate to="/account/login" replace />;
  }

  // If it's a real JWT (3 parts), validate expiry
  const parts = activeToken.split('.');
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        localStorage.removeItem('jwtToken');
        return <Navigate to="/account/login" replace />;
      }
    } catch {
      // Malformed JWT — clear it and redirect
      localStorage.removeItem('jwtToken');
      return <Navigate to="/account/login" replace />;
    }
  }
  // Demo token (not a real JWT) — let through without expiry check

  return <Outlet />;
};

export default ProtectedRoute;
