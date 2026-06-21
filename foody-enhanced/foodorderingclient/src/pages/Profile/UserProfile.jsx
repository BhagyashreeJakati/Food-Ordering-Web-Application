import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LogoutIcon from '@mui/icons-material/Logout';

export default function UserProfile() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/account/login');
  };

  const LINKS = [
    { label: 'My Orders', path: '/profile/orders', icon: <ShoppingBagOutlinedIcon />, desc: 'Track & reorder' },
    { label: 'Favourites', path: '/profile/favorites', icon: <FavoriteBorderIcon />, desc: 'Saved restaurants' },
    { label: 'Addresses', path: '/profile/address', icon: <LocationOnOutlinedIcon />, desc: 'Delivery addresses' },
    { label: 'Track Order', path: '/profile/orders', icon: <TrackChangesIcon />, desc: 'Live order tracking' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6" style={{ color: theme.palette.text.primary }}>My Profile</h1>

      {/* User card */}
      <div className="rounded-2xl p-6 flex items-center gap-5 mb-4"
        style={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
        <Avatar sx={{ width: 72, height: 72, backgroundColor: '#ff5722', fontSize: '1.8rem', fontWeight: 700 }}>
          {(user?.fullName || 'U').charAt(0).toUpperCase()}
        </Avatar>
        <div>
          <h2 className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>
            {user?.fullName || user?.userName}
          </h2>
          <div className="flex items-center gap-2 mt-1" style={{ color: theme.palette.text.secondary }}>
            <EmailIcon sx={{ fontSize: '.9rem' }} />
            <span className="text-sm">{user?.email}</span>
          </div>
          <Chip
            label={user?.role?.replace('ROLE_', '') || 'Customer'}
            size="small"
            sx={{ mt: 1, backgroundColor: '#fff3e0', color: '#ff5722', fontWeight: 600, fontSize: '.7rem' }}
          />
        </div>
      </div>

      {/* Change Password button */}
      <button onClick={() => navigate('/profile/change-password')}
        className="w-full flex items-center gap-3 p-4 rounded-2xl mb-4 text-left"
        style={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#fff0eb' }}>
          <LockIcon sx={{ color: '#ff5722', fontSize: '1.1rem' }} />
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: theme.palette.text.primary }}>Change Password</p>
          <p className="text-xs" style={{ color: theme.palette.text.secondary }}>Update your account password</p>
        </div>
        <span className="ml-auto" style={{ color: theme.palette.text.secondary }}>›</span>
      </button>

      {/* Navigation grid */}
      <div className="grid grid-cols-2 gap-4">
        {LINKS.map(card => (
          <button key={card.label} onClick={() => navigate(card.path)}
            className="rounded-2xl p-5 text-left hover:shadow-md transition-shadow active:scale-95"
            style={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
            <div className="mb-2" style={{ color: '#ff5722' }}>{card.icon}</div>
            <p className="font-bold text-sm" style={{ color: theme.palette.text.primary }}>{card.label}</p>
            <p className="text-xs mt-0.5" style={{ color: theme.palette.text.secondary }}>{card.desc}</p>
          </button>
        ))}
      </div>

      {/* Logout */}
      <button onClick={handleLogout}
        className="w-full flex items-center gap-3 p-4 rounded-2xl mt-4 text-left"
        style={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#fff0eb' }}>
          <LogoutIcon sx={{ color: '#ff5722', fontSize: '1.1rem' }} />
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: theme.palette.text.primary }}>Logout</p>
          <p className="text-xs" style={{ color: theme.palette.text.secondary }}>Sign out of your account</p>
        </div>
      </button>
    </div>
  );
}
