import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decrementCart } from '../redux/slices/cartSlice';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { toast } from 'react-toastify';

const isOwner = (user) => {
  if (!user?.role) return false;
  const r = typeof user.role === 'string' ? user.role : user.role?.name || '';
  return r === 'ROLE_RESTAURANT_OWNER';
};

export default function MenuCard({ item }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { cart } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const cartItem = cart.find(i => i.id === item.id);
  const img = item.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
  const adminUser = isOwner(user);

  const handleAdd = () => {
    if (adminUser) { toast.error('Restaurant owners cannot place orders.'); return; }
    dispatch(addToCart(item));
    if (!cartItem) toast.success(`${item.name} added! 🛒`, { autoClose: 1500 });
  };

  const handleDec = () => {
    if (adminUser) return;
    dispatch(decrementCart(item.id));
  };

  return (
    <div className="flex items-start gap-4 py-5" style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-4 h-4 rounded-sm border-2 flex items-center justify-center"
          style={{ borderColor: item.vegetarian ? '#2e7d32' : '#c62828' }}>
          <div className="w-2 h-2 rounded-full"
            style={{ backgroundColor: item.vegetarian ? '#2e7d32' : '#c62828' }} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base" style={{ color: theme.palette.text.primary }}>{item.name}</h3>
        <p className="font-bold mt-1 text-sm" style={{ color: theme.palette.text.primary }}>₹{item.price}</p>
        {item.description && (
          <p className="text-xs mt-1.5 leading-relaxed line-clamp-2" style={{ color: theme.palette.text.secondary }}>
            {item.description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 flex flex-col items-center gap-2">
        <img src={img} alt={item.name} className="w-24 h-20 object-cover rounded-xl" />
        {adminUser ? (
          <span className="text-xs px-2 py-1 rounded-lg"
            style={{ backgroundColor: '#fff0eb', color: '#ff5722' }}>
            View only
          </span>
        ) : !cartItem ? (
          <button onClick={handleAdd}
            className="flex items-center gap-1 px-4 py-1.5 rounded-xl text-sm font-bold border-2 transition-all"
            style={{ borderColor: '#ff5722', color: '#ff5722', backgroundColor: theme.palette.background.paper }}>
            <AddIcon sx={{ fontSize: '1rem' }} /> ADD
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-xl px-2 py-1"
            style={{ backgroundColor: '#ff5722' }}>
            <button onClick={handleDec} className="text-white">
              <RemoveIcon sx={{ fontSize: '1rem' }} />
            </button>
            <span className="text-white font-bold text-sm">{cartItem.quantity}</span>
            <button onClick={handleAdd} className="text-white">
              <AddIcon sx={{ fontSize: '1rem' }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
