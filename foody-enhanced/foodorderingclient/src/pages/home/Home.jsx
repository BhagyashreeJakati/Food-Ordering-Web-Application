import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchResturants } from '../../redux/slices/restaurantSlice';
import { addToFavorite } from '../../redux/slices/authSlice';
import { useTheme } from '@mui/material/styles';
import { InputBase, CircularProgress, Modal, Box, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate as useNav } from 'react-router-dom';
import { toast } from 'react-toastify';
import { truncateText } from '../../utils/TruncateText';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1400&q=80',
];

const CATEGORIES = [
  { label:'All', emoji:'🍽️', keywords:[] },
  { label:'Biryani', emoji:'🍚', keywords:['biryani','indian','north indian','south indian'] },
  { label:'Pizza', emoji:'🍕', keywords:['pizza','italian'] },
  { label:'Burgers', emoji:'🍔', keywords:['burger','american'] },
  { label:'Chinese', emoji:'🥡', keywords:['chinese','dragon','noodle'] },
  { label:'South Indian', emoji:'🥘', keywords:['south indian','dosa','idli','cafe'] },
  { label:'Desserts', emoji:'🍰', keywords:['dessert','cake','sweet','lounge'] },
];

const OFFERS = [
  { label:'50% OFF up to ₹100', sub:'Use WELCOME50', code:'WELCOME50', color:'#E23744', img:'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80', desc:'50% OFF up to ₹100. No minimum order!', validity:'Valid for all users · No minimum', savings:'Save up to ₹100' },
  { label:'Free Delivery', sub:'Use FREESHIP', code:'FREESHIP', color:'#1E88E5', img:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', desc:'Free delivery on any order.', validity:'Valid on all orders', savings:'Save ₹40' },
  { label:'₹75 OFF', sub:'Use FEAST75', code:'FEAST75', color:'#43A047', img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', desc:'Flat ₹75 OFF on orders above ₹299.', validity:'Min order ₹299', savings:'Save ₹75' },
  { label:'₹100 OFF', sub:'Use SAVE100', code:'SAVE100', color:'#7B1FA2', img:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80', desc:'Flat ₹100 OFF on orders above ₹499.', validity:'Min order ₹499', savings:'Save ₹100' },
  { label:'30% OFF', sub:'Use NEWUSER', code:'NEWUSER', color:'#FF6F00', img:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=400&q=80', desc:'30% OFF up to ₹80 for new users!', validity:'New users only', savings:'Save up to ₹80' },
];

const fakeRating = (id) => (3.5 + ((id||1) % 15) * 0.1).toFixed(1);
const fakeTime = (id) => 20 + ((id||1) % 5) * 5;

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { restaurants: all, loading } = useSelector(s => s.restaurants);
  const { favorites } = useSelector(s => s.auth);
  const [heroIdx, setHeroIdx] = useState(0);
  const [searchQ, setSearchQ] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [vegOnly, setVegOnly] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => { dispatch(fetchResturants()); }, [dispatch]);
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i+1) % HERO_IMAGES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const displayed = useMemo(() => {
    let list = [...(all||[])];
    if (activeCategory && activeCategory !== 'All') {
      const cat = CATEGORIES.find(c => c.label === activeCategory);
      if (cat?.keywords.length) list = list.filter(r => cat.keywords.some(kw => [r.name,r.description,r.cuisineType].join(' ').toLowerCase().includes(kw)));
    }
    if (searchQ.trim()) list = list.filter(r => [r.name,r.description,r.cuisineType,r.address?.city].join(' ').toLowerCase().includes(searchQ.toLowerCase()));
    if (vegOnly) list = list.filter(r => ['veg','south indian','dessert','cafe'].some(kw => [r.name,r.description,r.cuisineType].join(' ').toLowerCase().includes(kw)));
    if (openNow) list = list.filter(r => r.open === true);
    if (sortBy === 'rating') list = [...list].sort((a,b) => parseFloat(fakeRating(b.id)) - parseFloat(fakeRating(a.id)));
    if (sortBy === 'time') list = [...list].sort((a,b) => fakeTime(a.id) - fakeTime(b.id));
    return list;
  }, [all, activeCategory, searchQ, vegOnly, openNow, sortBy]);

  const anyFilter = activeCategory || searchQ || vegOnly || openNow || sortBy;

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(()=>{});
    localStorage.setItem('pendingCoupon', code);
    toast.success(`Code "${code}" copied! Go to cart to apply.`);
    setSelectedOffer(null);
  };

  const SkeletonCard = () => (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
      <div className="h-44 w-full animate-pulse" style={{ backgroundColor: theme.palette.divider }} />
      <div className="p-3 space-y-2">
        <div className="h-4 rounded animate-pulse w-3/4" style={{ backgroundColor: theme.palette.divider }} />
        <div className="h-3 rounded animate-pulse w-1/2" style={{ backgroundColor: theme.palette.divider }} />
        <div className="h-3 rounded animate-pulse w-2/3 mt-3" style={{ backgroundColor: theme.palette.divider }} />
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: theme.palette.background.default, minHeight:'100vh' }}>

      {/* ── Hero ── */}
      <div className="relative h-[420px] lg:h-[480px] overflow-hidden">
        {HERO_IMAGES.map((img,i) => (
          <img key={i} src={img} alt="hero" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" style={{ opacity: i===heroIdx?1:0 }} />
        ))}
        <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.75))' }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-white text-center">
          <p className="text-sm font-semibold mb-2 tracking-widest uppercase opacity-75">India's #1 Food Delivery App</p>
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-2 leading-tight">
            Hungry? We've got you<br/><span style={{ color:'#ff5722' }}>covered.</span>
          </h1>
          <p className="text-base lg:text-lg opacity-80 mb-8">Order from top restaurants — delivered in 30 minutes</p>
          <div className="w-full max-w-2xl flex items-center bg-white rounded-xl px-4 py-3 gap-3 shadow-2xl">
            <SearchIcon style={{ color:'#999', flexShrink:0 }} />
            <InputBase fullWidth placeholder="Search for restaurants, cuisines, or dishes…"
              value={searchQ} onChange={e => setSearchQ(e.target.value)}
              sx={{ fontSize:'.95rem', color:'#333' }} />
            {searchQ && <button onClick={() => setSearchQ('')} className="text-gray-400 hover:text-gray-600 text-xl">×</button>}
          </div>
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {HERO_IMAGES.map((_,i) => (
            <button key={i} onClick={() => setHeroIdx(i)}
              className="rounded-full transition-all"
              style={{ width: i===heroIdx?22:8, height:8, backgroundColor: i===heroIdx?'#ff5722':'rgba(255,255,255,0.5)' }} />
          ))}
        </div>
      </div>

      {/* ── Offers Strip ── */}
      <div className="px-4 lg:px-10 py-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>🎁 Offers & Coupons</h2>
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor:'#fff3e0', color:'#ff5722' }}>Tap to copy code</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth:'none' }}>
          {OFFERS.map((offer,i) => (
            <div key={i} onClick={() => setSelectedOffer(offer)}
              className="flex-shrink-0 flex items-center gap-4 rounded-2xl px-5 py-4 cursor-pointer hover:scale-105 transition-transform active:scale-95"
              style={{ backgroundColor: offer.color, minWidth:270 }}>
              <img src={offer.img} alt={offer.label} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="text-white">
                <p className="font-bold text-base leading-tight">{offer.label}</p>
                <p className="text-xs opacity-80 mt-0.5">{offer.sub}</p>
                <span className="text-xs font-bold mt-2 inline-block bg-white bg-opacity-20 px-2 py-0.5 rounded-full">{offer.savings}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      <div className="px-4 lg:px-10 mb-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: theme.palette.text.primary }}>What's on your mind?</h2>
        <div className="flex gap-3 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat.label}
              onClick={() => setActiveCategory(prev => prev===cat.label ? null : cat.label)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all active:scale-95"
              style={{
                backgroundColor: activeCategory===cat.label ? '#ff5722' : theme.palette.background.paper,
                color: activeCategory===cat.label ? '#fff' : theme.palette.text.primary,
                borderColor: activeCategory===cat.label ? '#ff5722' : theme.palette.divider,
                boxShadow: activeCategory===cat.label ? '0 2px 8px rgba(255,87,34,.35)' : 'none',
              }}>
              <span style={{ fontSize:'1.1rem' }}>{cat.emoji}</span>{cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="px-4 lg:px-10 mb-6 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-semibold" style={{ color: theme.palette.text.secondary }}>Filter:</span>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="px-3 py-1.5 rounded-full text-sm font-semibold border outline-none cursor-pointer"
          style={{ backgroundColor: sortBy ? '#ff5722' : theme.palette.background.paper, color: sortBy ? '#fff' : theme.palette.text.primary, borderColor: sortBy ? '#ff5722' : theme.palette.divider }}>
          <option value="">Sort By</option>
          <option value="rating">⭐ Rating</option>
          <option value="time">🕐 Delivery Time</option>
        </select>
        {[
          { key:'veg', label:'🥦 Pure Veg', state:vegOnly, set:setVegOnly },
          { key:'open', label:'🟢 Open Now', state:openNow, set:setOpenNow },
        ].map(f => (
          <button key={f.key} onClick={() => f.set(v => !v)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all"
            style={{ backgroundColor: f.state ? (f.key==='veg'?'#16a34a':'#1d4ed8') : theme.palette.background.paper, color: f.state ? '#fff' : theme.palette.text.primary, borderColor: f.state ? 'transparent' : theme.palette.divider }}>
            {f.label}
          </button>
        ))}
        {anyFilter && (
          <button onClick={() => { setActiveCategory(null); setSearchQ(''); setVegOnly(false); setOpenNow(false); setSortBy(''); }}
            className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ backgroundColor:'#fee2e2', color:'#991b1b' }}>
            ✕ Clear All
          </button>
        )}
      </div>

      {/* ── Restaurant Grid ── */}
      <div className="px-4 lg:px-10 pb-16">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>
              {activeCategory && activeCategory !== 'All' ? `${CATEGORIES.find(c=>c.label===activeCategory)?.emoji} ${activeCategory}`
                : searchQ ? `Results for "${searchQ}"` : 'All Restaurants Near You'}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: theme.palette.text.secondary }}>{displayed.length} restaurant{displayed.length!==1?'s':''}</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({length:8}).map((_,i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-xl font-semibold mb-2" style={{ color: theme.palette.text.primary }}>No restaurants found</p>
            <button onClick={() => { setActiveCategory(null); setSearchQ(''); setVegOnly(false); setOpenNow(false); setSortBy(''); }}
              className="mt-4 px-6 py-2.5 rounded-xl text-white font-semibold" style={{ backgroundColor:'#ff5722' }}>
              Show All Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayed.map(r => {
              const isFav = favorites.some(f => f.id === r.id);
              const img = r.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80';
              return (
                <div key={r.id}
                  onClick={() => r.open && navigate(`/restaurant/${r.id}`)}
                  className="rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg"
                  style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}`, opacity: r.open?1:0.65 }}>
                  <div className="relative overflow-hidden h-44">
                    <img src={img} alt={r.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0" style={{ background:'linear-gradient(to top,rgba(0,0,0,0.4),transparent 60%)' }} />
                    <div className="absolute top-2 left-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: r.open?'#2e7d32':'#c62828' }}>{r.open?'OPEN':'CLOSED'}</span>
                    </div>
                    <button className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor:'rgba(0,0,0,0.45)' }}
                      onClick={e => { e.stopPropagation(); dispatch(addToFavorite(r.id)); toast.success(isFav ? 'Removed from favourites' : `${r.name} added to favourites ❤️`); }}>
                      {isFav ? <FavoriteIcon sx={{ fontSize:'1rem', color:'#E23744' }} /> : <FavoriteBorderIcon sx={{ fontSize:'1rem', color:'#fff' }} />}
                    </button>
                    {r.open && <div className="absolute bottom-2 left-2 text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded">FREE DELIVERY</div>}
                  </div>
                  <div className="p-3 flex flex-col gap-1 flex-1">
                    <h3 className="font-bold text-base leading-tight truncate" style={{ color: theme.palette.text.primary }}>{r.name}</h3>
                    <p className="text-xs truncate" style={{ color: theme.palette.text.secondary }}>{r.cuisineType || truncateText(r.description, 40)}</p>
                    <div className="flex items-center gap-3 mt-auto pt-2" style={{ borderTop:`1px solid ${theme.palette.divider}` }}>
                      <div className="flex items-center gap-0.5">
                        <StarIcon sx={{ fontSize:'.85rem', color:'#2e7d32' }} />
                        <span className="text-xs font-bold" style={{ color:'#2e7d32' }}>{fakeRating(r.id)}</span>
                      </div>
                      <span className="text-xs" style={{ color: theme.palette.divider }}>•</span>
                      <div className="flex items-center gap-0.5">
                        <AccessTimeIcon sx={{ fontSize:'.85rem', color: theme.palette.text.secondary }} />
                        <span className="text-xs" style={{ color: theme.palette.text.secondary }}>{fakeTime(r.id)} min</span>
                      </div>
                      <span className="text-xs" style={{ color: theme.palette.divider }}>•</span>
                      <span className="text-xs truncate" style={{ color: theme.palette.text.secondary }}>{r.address?.city||'Nearby'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Offer Modal ── */}
      <Modal open={!!selectedOffer} onClose={() => setSelectedOffer(null)}>
        <Box sx={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', bgcolor:'background.paper', borderRadius:3, boxShadow:24, outline:'none', width:{xs:'92%',sm:440}, overflow:'hidden' }}>
          {selectedOffer && <>
            <div className="relative h-44" style={{ backgroundColor: selectedOffer.color }}>
              <img src={selectedOffer.img} alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                <p className="text-3xl font-extrabold">{selectedOffer.label}</p>
                <p className="text-sm opacity-90 mt-1">{selectedOffer.savings}</p>
              </div>
              <button onClick={() => setSelectedOffer(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor:'rgba(0,0,0,0.4)' }}>
                <CloseIcon sx={{ color:'#fff', fontSize:'1rem' }} />
              </button>
            </div>
            <div className="p-6">
              <p className="font-bold text-base mb-2" style={{ color: theme.palette.text.primary }}>Offer Details</p>
              <p className="text-sm mb-3" style={{ color: theme.palette.text.secondary }}>{selectedOffer.desc}</p>
              <p className="text-xs mb-4 px-3 py-2 rounded-lg" style={{ backgroundColor: theme.palette.mode==='dark'?'#1a1a1a':'#f8f8f8', color: theme.palette.text.secondary }}>📌 {selectedOffer.validity}</p>
              <div className="flex items-center justify-between p-4 rounded-xl mb-4" style={{ border:`2px dashed ${selectedOffer.color}`, backgroundColor:'#fff3e0' }}>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">COUPON CODE</p>
                  <p className="text-2xl font-black font-mono" style={{ color: selectedOffer.color, letterSpacing:'.1em' }}>{selectedOffer.code}</p>
                </div>
                <button onClick={() => copyCode(selectedOffer.code)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ backgroundColor: selectedOffer.color }}>
                  <ContentCopyIcon sx={{ fontSize:'.9rem' }} /> Copy
                </button>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSelectedOffer(null)} className="flex-1 py-3 rounded-xl text-sm font-semibold border" style={{ borderColor: theme.palette.divider, color: theme.palette.text.secondary }}>Close</button>
                <button onClick={() => { copyCode(selectedOffer.code); navigate('/cart'); }} className="flex-1 py-3 rounded-xl text-white text-sm font-bold" style={{ backgroundColor: selectedOffer.color }}>Go to Cart & Apply</button>
              </div>
            </div>
          </>}
        </Box>
      </Modal>
    </div>
  );
}
