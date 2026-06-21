import { useDispatch } from 'react-redux';
import { addToCart, decrementCart, removeFromCart } from '../../redux/slices/cartSlice';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  if (!item) return null;
  return (
    <div className="flex items-center gap-4 px-5 py-4" style={{ borderBottom:`1px solid ${theme.palette.divider}` }}>
      <img src={item.images?.[0]||'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" onError={e=>e.target.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: theme.palette.text.primary }}>{item.name}</p>
        <p className="font-bold text-base mt-0.5" style={{ color:'#ff5722' }}>₹{(item.price * item.quantity).toFixed(2)}</p>
        <p className="text-xs mt-0.5" style={{ color: theme.palette.text.secondary }}>₹{item.price} each</p>
      </div>
      <div className="flex items-center rounded-lg overflow-hidden flex-shrink-0" style={{ border:`2px solid #ff5722` }}>
        <button onClick={() => dispatch(decrementCart(item.id))} className="px-2 py-1.5" style={{ backgroundColor:'#fff3e0', color:'#ff5722' }}><RemoveIcon sx={{ fontSize:'.9rem' }} /></button>
        <span className="px-3 py-1.5 font-bold text-sm" style={{ color:'#ff5722', minWidth:28, textAlign:'center' }}>{item.quantity}</span>
        <button onClick={() => dispatch(addToCart(item))} disabled={item.quantity>=10} className="px-2 py-1.5" style={{ backgroundColor:'#ff5722', color:'#fff' }}><AddIcon sx={{ fontSize:'.9rem' }} /></button>
      </div>
      <button onClick={() => dispatch(removeFromCart(item.id))} className="ml-2 flex-shrink-0"><DeleteOutlineIcon sx={{ fontSize:'1.1rem', color: theme.palette.text.secondary }} /></button>
    </div>
  );
}
