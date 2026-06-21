import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToFavorite } from '../../redux/slices/authSlice';
import { useTheme } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { truncateText } from '../../utils/TruncateText';
import { toast } from 'react-toastify';

const fakeRating = (id) => (3.5 + ((id||1) % 15) * 0.1).toFixed(1);
const fakeTime = (id) => 20 + ((id||1) % 5) * 5;

export default function RestaurantCard({ restaurant }) {
  const { favorites } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isOpen = restaurant?.open ?? false;
  const isFav = favorites.some(f => f.id === restaurant?.id);

  return (
    <div className="rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}`, opacity:isOpen?1:0.65 }}
      onClick={() => isOpen && navigate(`/restaurant/${restaurant?.id}`)}>
      <div className="relative overflow-hidden h-44">
        <img src={restaurant?.images?.[0]||'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'} alt={restaurant?.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0" style={{ background:'linear-gradient(to top,rgba(0,0,0,0.4),transparent 60%)' }} />
        <div className="absolute top-2 left-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor:isOpen?'#2e7d32':'#c62828' }}>{isOpen?'OPEN':'CLOSED'}</span>
        </div>
        <button className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor:'rgba(0,0,0,0.45)' }}
          onClick={e => { e.stopPropagation(); dispatch(addToFavorite(restaurant?.id)); toast.success(isFav?'Removed from favourites':`${restaurant?.name} saved ❤️`); }}>
          {isFav ? <FavoriteIcon sx={{ fontSize:'1rem', color:'#E23744' }} /> : <FavoriteBorderIcon sx={{ fontSize:'1rem', color:'#fff' }} />}
        </button>
        {isOpen && <div className="absolute bottom-2 left-2 text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded">FREE DELIVERY</div>}
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="font-bold text-base leading-tight truncate" style={{ color: theme.palette.text.primary }}>{restaurant?.name}</h3>
        <p className="text-xs truncate" style={{ color: theme.palette.text.secondary }}>{restaurant?.cuisineType||truncateText(restaurant?.description,40)}</p>
        <div className="flex items-center gap-3 mt-auto pt-2" style={{ borderTop:`1px solid ${theme.palette.divider}` }}>
          <div className="flex items-center gap-0.5"><StarIcon sx={{ fontSize:'.85rem', color:'#2e7d32' }} /><span className="text-xs font-bold" style={{ color:'#2e7d32' }}>{fakeRating(restaurant?.id)}</span></div>
          <span className="text-xs" style={{ color: theme.palette.divider }}>•</span>
          <div className="flex items-center gap-0.5"><AccessTimeIcon sx={{ fontSize:'.85rem', color: theme.palette.text.secondary }} /><span className="text-xs" style={{ color: theme.palette.text.secondary }}>{fakeTime(restaurant?.id)} min</span></div>
          <span className="text-xs" style={{ color: theme.palette.divider }}>•</span>
          <span className="text-xs truncate" style={{ color: theme.palette.text.secondary }}>{restaurant?.address?.city||'Nearby'}</span>
        </div>
      </div>
    </div>
  );
}
