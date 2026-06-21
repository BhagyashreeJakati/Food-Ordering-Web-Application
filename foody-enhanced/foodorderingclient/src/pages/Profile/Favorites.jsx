import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { addToFavorite } from '../../redux/slices/authSlice';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';

const fakeRating = (id) => (3.5 + ((id||1) % 15) * 0.1).toFixed(1);
const fakeTime = (id) => 20 + ((id||1) % 5) * 5;

export default function Favorites() {
  const { favorites } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold mb-6" style={{ color: theme.palette.text.primary }}>My Favourites</h1>
      {favorites.length===0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">❤️</div>
          <p className="text-xl font-semibold mb-2" style={{ color: theme.palette.text.primary }}>No favourites yet</p>
          <p style={{ color: theme.palette.text.secondary }}>Tap the heart on any restaurant to save it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((r,i) => (
            <div key={r.id||i} className="rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }} onClick={() => r.open && navigate(`/restaurant/${r.id}`)}>
              <div className="relative h-40 overflow-hidden">
                <img src={r.images?.[0]||'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'} alt={r.name} className="w-full h-full object-cover" />
                <button className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor:'rgba(0,0,0,0.45)' }} onClick={e=>{e.stopPropagation();dispatch(addToFavorite(r.id));}}>
                  <FavoriteIcon sx={{ fontSize:'1rem', color:'#E23744' }} />
                </button>
              </div>
              <div className="p-3">
                <p className="font-bold text-sm truncate">{r.name}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: theme.palette.text.secondary }}>{r.cuisineType||''}</p>
                <div className="flex items-center gap-3 mt-2 pt-2" style={{ borderTop:`1px solid ${theme.palette.divider}` }}>
                  <span className="text-xs font-bold flex items-center gap-0.5" style={{ color:'#2e7d32' }}><StarIcon sx={{ fontSize:'.8rem' }} />{fakeRating(r.id)}</span>
                  <span className="text-xs" style={{ color: theme.palette.text.secondary }}>•</span>
                  <span className="text-xs flex items-center gap-0.5" style={{ color: theme.palette.text.secondary }}><AccessTimeIcon sx={{ fontSize:'.8rem' }} />{fakeTime(r.id)} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
