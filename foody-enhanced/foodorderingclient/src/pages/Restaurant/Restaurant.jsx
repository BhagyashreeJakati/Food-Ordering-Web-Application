import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRestaurantById, fetchRestaurantFoods, getRestaurantCategory } from '../../redux/slices/restaurantSlice';
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import MenuCard from '../../components/MenuCard';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector as useCart } from 'react-redux';

const fakeRating = (id) => (3.5 + ((id||1) % 15) * 0.1).toFixed(1);

export default function Restaurant() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const { restaurant, restaurantFoods, category, loading } = useSelector(s => s.restaurants);
  const { cart } = useSelector(s => s.cart);
  const [foodType, setFoodType] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => { dispatch(fetchRestaurantById(restaurantId)); dispatch(getRestaurantCategory(restaurantId)); }, [restaurantId, dispatch]);
  useEffect(() => {
    dispatch(fetchRestaurantFoods({ restaurantId, vegetarian:foodType==='veg', nonveg:foodType==='nonveg', seasonal:false, foodCategory:activeCategory }));
  }, [restaurantId, foodType, activeCategory, dispatch]);

  const cartCount = cart.reduce((s,i)=>s+i.quantity,0);
  const cartTotal = cart.reduce((s,i)=>s+i.price*i.quantity,0);

  if (loading && !restaurant) return <div className="flex justify-center items-center min-h-[70vh]"><CircularProgress sx={{ color:'#ff5722' }} /></div>;

  return (
    <div style={{ backgroundColor: theme.palette.background.default, minHeight:'100vh' }}>
      {/* Cover */}
      <div className="relative h-64 lg:h-80 overflow-hidden">
        <img src={restaurant?.images?.[0]||'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'} alt={restaurant?.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.75))' }} />
        <button onClick={() => navigate('/')} className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor:'rgba(0,0,0,0.5)' }}>
          <ArrowBackIcon sx={{ color:'#fff', fontSize:'1.2rem' }} />
        </button>
        <div className="absolute bottom-5 left-5 text-white">
          <h1 className="text-3xl lg:text-4xl font-bold">{restaurant?.name}</h1>
          <p className="text-sm opacity-80 mt-1">{restaurant?.cuisineType||restaurant?.description?.slice(0,60)}</p>
        </div>
      </div>

      {/* Info bar */}
      <div className="px-5 lg:px-12 py-4" style={{ backgroundColor: theme.palette.background.paper, borderBottom:`1px solid ${theme.palette.divider}` }}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor:'#2e7d32' }}><StarIcon sx={{ color:'#fff', fontSize:'1rem' }} /><span className="text-white font-bold text-sm">{fakeRating(restaurant?.id)}</span></div>
          <div className="flex items-center gap-1.5 text-sm" style={{ color: theme.palette.text.secondary }}><AccessTimeIcon sx={{ fontSize:'1rem' }} />{restaurant?.openingHours||'10AM–10PM'}</div>
          <div className="flex items-center gap-1.5 text-sm" style={{ color: theme.palette.text.secondary }}><PlaceIcon sx={{ fontSize:'1rem' }} />{restaurant?.address?.street}, {restaurant?.address?.city}</div>
          <div className="ml-auto"><span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor:restaurant?.open?'#e8f5e9':'#ffebee', color:restaurant?.open?'#2e7d32':'#c62828' }}>{restaurant?.open?'Accepting Orders':'Closed'}</span></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row px-5 lg:px-12 py-6 gap-8">
        {/* Filters */}
        <aside className="lg:w-52 flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-5">
            <div>
              <p className="font-semibold text-xs mb-3 uppercase tracking-wide" style={{ color: theme.palette.text.secondary }}>Filter</p>
              {[{l:'All',v:'all'},{l:'🥦 Veg Only',v:'veg'},{l:'🍗 Non-Veg',v:'nonveg'}].map(f => (
                <button key={f.v} onClick={() => setFoodType(f.v)} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-2 transition-colors"
                  style={{ backgroundColor:foodType===f.v?'#fff3e0':'transparent', color:foodType===f.v?'#ff5722':theme.palette.text.secondary, border:`1px solid ${foodType===f.v?'#ff5722':theme.palette.divider}` }}>
                  {f.l}
                </button>
              ))}
            </div>
            {category?.length > 0 && (
              <div>
                <p className="font-semibold text-xs mb-3 uppercase tracking-wide" style={{ color: theme.palette.text.secondary }}>Categories</p>
                <button onClick={() => setActiveCategory('all')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-2 transition-colors"
                  style={{ backgroundColor:activeCategory==='all'?'#fff3e0':'transparent', color:activeCategory==='all'?'#ff5722':theme.palette.text.secondary, border:`1px solid ${activeCategory==='all'?'#ff5722':theme.palette.divider}` }}>
                  All Items
                </button>
                {category.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-2 transition-colors"
                    style={{ backgroundColor:activeCategory===cat.name?'#fff3e0':'transparent', color:activeCategory===cat.name?'#ff5722':theme.palette.text.secondary, border:`1px solid ${activeCategory===cat.name?'#ff5722':theme.palette.divider}` }}>
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Menu */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>Menu</h2>
            <span className="text-sm" style={{ color: theme.palette.text.secondary }}>{restaurantFoods?.length||0} items</span>
          </div>
          {loading ? <div className="flex justify-center py-16"><CircularProgress sx={{ color:'#ff5722' }} /></div>
          : restaurantFoods?.length===0 ? <div className="text-center py-16"><div className="text-5xl mb-3">🍽️</div><p style={{ color: theme.palette.text.secondary }}>No items for the selected filter</p></div>
          : <div className="rounded-2xl px-5" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>{restaurantFoods.map(item => <MenuCard key={item.id} item={item} />)}</div>}
        </div>
      </div>

      {/* Sticky cart bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3" style={{ background:'linear-gradient(135deg,#ff5722,#f97316)' }}>
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="text-white"><p className="font-bold">{cartCount} item{cartCount!==1?'s':''} in cart</p><p className="text-sm opacity-85">₹{cartTotal.toFixed(2)}</p></div>
            <button onClick={() => navigate('/cart')} className="bg-white font-bold text-sm px-6 py-2.5 rounded-xl" style={{ color:'#ff5722' }}>View Cart →</button>
          </div>
        </div>
      )}
    </div>
  );
}
