import { useThemeContext } from '../Theme/ThemeContext';
import { useTheme } from '@mui/material/styles';
import { Avatar, Badge, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userProfile, logout } from '../redux/slices/authSlice';
import { fetchResturants, searchRestaurants } from '../redux/slices/restaurantSlice';

const isOwner = (user) => {
  if (!user?.role) return false;
  const r = typeof user.role === 'string' ? user.role : user.role?.name || '';
  return r === 'ROLE_RESTAURANT_OWNER';
};

export default function NavBar() {
  const { token, user } = useSelector(s => s.auth);
  const { cart } = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const adminUser = isOwner(user);

  useEffect(() => { if (token) dispatch(userProfile()); }, [token, dispatch]);

  const handleLogout = () => {
    setMenuAnchor(null);
    dispatch(logout());
    navigate('/account/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && q.trim()) {
      const sanitized = q.trim().slice(0, 100);
      dispatch(searchRestaurants(sanitized));
      if (location.pathname !== '/') navigate('/');
      setShowSearch(false);
    }
    if (e.key === 'Escape') { setQ(''); setShowSearch(false); dispatch(fetchResturants()); }
  };
  const clearSearch = () => { setQ(''); setShowSearch(false); dispatch(fetchResturants()); };

  return (
    <nav className="w-full h-[70px] flex sticky top-0 z-50 items-center justify-between px-4 lg:px-10 shadow-sm"
      style={{ backgroundColor: theme.palette.background.nav, borderBottom: `1px solid ${theme.palette.divider}` }}>

      {/* Logo */}
      <div onClick={() => navigate('/')}
        className="flex items-center gap-2 cursor-pointer flex-shrink-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.palette.primary.main }}>
          <span className="text-white text-lg font-bold">F</span>
        </div>
        <span className="font-bold text-2xl hidden sm:block" style={{ color: theme.palette.primary.main }}>Foody</span>
        {adminUser && (
          <span className="hidden sm:block text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ backgroundColor: '#fff0eb', color: '#ff5722' }}>
            Admin
          </span>
        )}
      </div>

      {/* Search — hide for admin */}
      {!adminUser && (
        <div className="hidden lg:flex items-center flex-1 mx-8 rounded-xl px-4 py-2 gap-3"
          style={{ backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f8f8f8', border: `1px solid ${theme.palette.divider}` }}>
          <SearchIcon style={{ color: theme.palette.text.secondary, fontSize: '1.2rem' }} />
          <InputBase fullWidth placeholder="Search for restaurants, cuisines or dishes…"
            value={q} onChange={e => setQ(e.target.value)} onKeyDown={handleSearch}
            sx={{ fontSize: '.9rem' }} />
          {q && <IconButton size="small" onClick={clearSearch}><CloseIcon fontSize="small" /></IconButton>}
        </div>
      )}

      <div className="flex items-center gap-2 lg:gap-4">
        {!adminUser && (
          <IconButton className="lg:hidden" onClick={() => setShowSearch(true)}>
            <SearchIcon />
          </IconButton>
        )}
        <IconButton onClick={toggleTheme} size="small">
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon sx={{ color: theme.palette.text.primary }} />}
        </IconButton>

        {/* Cart icon — customers only */}
        {!adminUser && (
          <IconButton onClick={() => navigate('/cart')} size="small">
            <Badge badgeContent={cartCount} color="error" max={9}>
              <ShoppingBagOutlinedIcon sx={{ color: theme.palette.text.primary }} />
            </Badge>
          </IconButton>
        )}

        {/* Dashboard icon — admin only */}
        {adminUser && (
          <IconButton onClick={() => navigate('/admin')} size="small">
            <DashboardIcon sx={{ color: '#ff5722' }} />
          </IconButton>
        )}

        {user
          ? <>
              <Avatar
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{ width: 36, height: 36, backgroundColor: theme.palette.primary.main, cursor: 'pointer', fontSize: '.9rem', fontWeight: 700 }}>
                {(user?.fullName || user?.userName || 'U').charAt(0).toUpperCase()}
              </Avatar>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {!adminUser && (
                  <MenuItem onClick={() => { setMenuAnchor(null); navigate('/profile'); }}>
                    <ListItemText>My Profile</ListItemText>
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          : <button onClick={() => navigate('/account/login')}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold border transition-colors"
              style={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main }}>
              Sign In
            </button>
        }
      </div>

      {showSearch && !adminUser && (
        <div className="absolute inset-0 z-50 flex items-center px-4 gap-3"
          style={{ backgroundColor: theme.palette.background.nav }}>
          <SearchIcon style={{ color: theme.palette.text.secondary }} />
          <InputBase autoFocus fullWidth placeholder="Search restaurants or dishes…"
            value={q} onChange={e => setQ(e.target.value)} onKeyDown={handleSearch} />
          <IconButton onClick={clearSearch}><CloseIcon /></IconButton>
        </div>
      )}
    </nav>
  );
}
