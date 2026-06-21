import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const isOwner = (user) => {
  if (!user?.role) return false;
  const role = typeof user.role === 'string' ? user.role : user.role?.name || '';
  return role === 'ROLE_RESTAURANT_OWNER';
};

const AdminRoute = () => {
  const { token, user, profileLoading } = useSelector(state => state.auth);
  const activeToken = token || localStorage.getItem('jwtToken');

  // No token at all — send to login
  if (!activeToken) return <Navigate to="/account/login" replace />;

  // Token exists but user not loaded yet (page refresh) — wait for profile fetch
  if (!user || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress sx={{ color: '#ff5722' }} />
      </div>
    );
  }

  // User loaded but not an owner — send to home
  if (!isOwner(user)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRoute;
