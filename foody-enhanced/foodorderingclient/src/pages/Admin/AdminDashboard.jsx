/* import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { MOCK_ADMIN_RESTAURANT } from '../../utils/mockData';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('jwtToken');
    navigate('/account/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) { navigate('/account/login'); return; }
    axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1'}/admin/restaurants/user`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.data?.payload?.length > 0) setRestaurant(r.data.payload[0]); else setRestaurant(MOCK_ADMIN_RESTAURANT); })
      .catch(() => setRestaurant(MOCK_ADMIN_RESTAURANT)) // Demo mode
      .finally(() => setLoading(false));
  }, [navigate]);

  const navLinks = [
    { to: "/admin", label: "Restaurant", icon: <StorefrontIcon fontSize="small" />, end: true },
    { to: "/admin/analytics", label: "Analytics", icon: <TrendingUpIcon fontSize="small" /> },
    { to: '/admin/food', label: 'Manage Menu', icon: <RestaurantMenuIcon fontSize="small" /> },
    { to: '/admin/orders', label: 'Manage Orders', icon: <ReceiptLongIcon fontSize="small" /> },
  ];

  if (loading) return <div className="flex justify-center items-center min-h-screen"><CircularProgress sx={{ color: '#ff5722' }} /></div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-white shadow-sm flex-shrink-0 flex flex-col">
        <div className="px-5 py-5 flex items-center gap-2 border-b">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ff5722' }}>
            <DashboardIcon sx={{ color: '#fff', fontSize: '1rem' }} />
          </div>
          <span className="font-bold text-base">Admin Panel</span>
        </div>
        {restaurant && (
          <div className="px-5 py-3 bg-orange-50 border-b">
            <p className="text-xs text-gray-400">Managing</p>
            <p className="font-semibold text-sm text-gray-800 truncate">{restaurant.name}</p>
          </div>
        )}
        <nav className="py-3 flex-1">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${isActive ? 'text-orange-600 bg-orange-50 border-r-2 border-orange-500' : 'text-gray-600 hover:bg-gray-50'}`
              }>
              {l.icon}{l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
          >
            <LogoutIcon fontSize="small" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet context={[restaurant, setRestaurant]} />
      </main>
    </div>
  );
};

export default AdminDashboard; */


import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);   // full list
  const [restaurant, setRestaurant] = useState(null);   // currently selected
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('jwtToken');
    navigate('/account/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) { navigate('/account/login'); return; }
    axios.get(
      `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1'}/admin/restaurants/user`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(r => {
        const list = r.data?.payload || [];
        setRestaurants(list);
        setRestaurant(list[0] || null);
      })
      .catch(() => {
        setRestaurants([]);
        setRestaurant(null);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Called from AdminRestaurant after a new restaurant is created
  const handleRestaurantAdded = (newRestaurant) => {
    setRestaurants(prev => [...prev, newRestaurant]);
    setRestaurant(newRestaurant);
  };

  // Called from AdminRestaurant after status toggle
  const handleRestaurantUpdated = (updated) => {
    setRestaurants(prev => prev.map(r => r.id === updated.id ? updated : r));
    setRestaurant(updated);
  };

  const navLinks = [
    { to: '/admin', label: 'Restaurants', icon: <StorefrontIcon fontSize="small" />, end: true },
    { to: '/admin/analytics', label: 'Analytics', icon: <TrendingUpIcon fontSize="small" /> },
    { to: '/admin/food', label: 'Manage Menu', icon: <RestaurantMenuIcon fontSize="small" /> },
    { to: '/admin/orders', label: 'Manage Orders', icon: <ReceiptLongIcon fontSize="small" /> },
  ];

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress sx={{ color: '#ff5722' }} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-white shadow-sm flex-shrink-0 flex flex-col">

        {/* Header */}
        <div className="px-5 py-5 flex items-center gap-2 border-b">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ff5722' }}>
            <DashboardIcon sx={{ color: '#fff', fontSize: '1rem' }} />
          </div>
          <span className="font-bold text-base">Admin Panel</span>
        </div>

        {/* Restaurant switcher */}
        <div className="px-4 py-3 border-b bg-orange-50">
          <p className="text-xs text-gray-400 mb-1.5">Active Restaurant</p>
          {restaurants.length > 0 ? (
            <select
              value={restaurant?.id || ''}
              onChange={e => setRestaurant(restaurants.find(r => String(r.id) === e.target.value) || null)}
              className="w-full text-sm font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer truncate"
            >
              {restaurants.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-gray-400 italic">No restaurant yet</p>
          )}
        </div>

        {/* Nav */}
        <nav className="py-3 flex-1">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${isActive ? 'text-orange-600 bg-orange-50 border-r-2 border-orange-500' : 'text-gray-600 hover:bg-gray-50'}`
              }>
              {l.icon}{l.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-5 py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
          >
            <LogoutIcon fontSize="small" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet context={[restaurant, handleRestaurantAdded, handleRestaurantUpdated]} />
      </main>
    </div>
  );
};

export default AdminDashboard;

