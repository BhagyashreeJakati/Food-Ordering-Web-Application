import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useTheme } from '@mui/material/styles';
import { Avatar, Drawer, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const NAV = [
  { label:'My Profile', path:'/profile', icon:<PersonOutlineIcon /> },
  { label:'My Orders', path:'/profile/orders', icon:<ShoppingBagOutlinedIcon /> },
  { label:'Favourites', path:'/profile/favorites', icon:<FavoriteBorderIcon /> },
  { label:'Addresses', path:'/profile/address', icon:<LocationOnOutlinedIcon /> },
];

function Sidebar({ onClose }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const location = useLocation();
  const go = (path) => { navigate(path); if (onClose) onClose(); };
  return (
    <div className="w-64 h-full flex flex-col" style={{ backgroundColor: theme.palette.background.paper }}>
      <div className="px-6 py-8" style={{ background:'linear-gradient(135deg,#ff5722,#e64a19)' }}>
        <Avatar sx={{ width:56, height:56, backgroundColor:'rgba(255,255,255,.25)', fontSize:'1.5rem', fontWeight:700, mb:2 }}>
          {(user?.fullName||user?.userName||'U').charAt(0).toUpperCase()}
        </Avatar>
        <p className="text-white font-bold text-lg leading-tight">{user?.fullName||user?.userName}</p>
        <p className="text-white text-sm opacity-80">{user?.email}</p>
      </div>
      <div className="flex-1 py-4">
        {NAV.map(item => {
          const active = location.pathname===item.path||(item.path!=='/profile'&&location.pathname.startsWith(item.path));
          return (
            <button key={item.path} onClick={() => go(item.path)} className="w-full flex items-center gap-4 px-6 py-4 text-left transition-colors"
              style={{ backgroundColor:active?'#fff3e0':'transparent', borderRight:active?'3px solid #ff5722':'3px solid transparent', color:active?'#ff5722':theme.palette.text.secondary }}>
              <span style={{ color:active?'#ff5722':theme.palette.text.secondary }}>{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
      <button onClick={() => { dispatch(logout()); navigate('/'); }} className="flex items-center gap-4 px-6 py-4 mb-4" style={{ color:'#c62828' }}>
        <LogoutIcon /><span className="font-medium text-sm">Logout</span>
      </button>
    </div>
  );
}

export default function Profile() {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:900px)');
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: theme.palette.background.default }}>
      {!isMobile && <div className="w-64 flex-shrink-0 sticky top-[70px] h-[calc(100vh-70px)] overflow-y-auto" style={{ borderRight:`1px solid ${theme.palette.divider}` }}><Sidebar /></div>}
      {isMobile && (
        <>
          <div className="fixed top-[70px] left-0 z-30 p-3"><button onClick={() => setOpen(true)} className="p-2 rounded-lg" style={{ backgroundColor: theme.palette.background.paper }}><MenuIcon /></button></div>
          <Drawer open={open} onClose={() => setOpen(false)}><Sidebar onClose={() => setOpen(false)} /></Drawer>
        </>
      )}
      <div className="flex-1 overflow-auto"><Outlet /></div>
    </div>
  );
}
