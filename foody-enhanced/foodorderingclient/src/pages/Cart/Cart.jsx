import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Collapse } from '@mui/material';

// Block admin from cart — defined before component
const isOwner = (user) => {
  if (!user?.role) return false;
  const r = typeof user.role === 'string' ? user.role : user.role?.name || '';
  return r === 'ROLE_RESTAURANT_OWNER';
};
import CartItem from './CartItem';
import { toast } from 'react-toastify';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SecurityIcon from '@mui/icons-material/Security';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const COUPONS = {
  WELCOME50:{ type:'percent', value:50, max:100, desc:'50% OFF up to ₹100' },
  FEAST75:  { type:'flat',    value:75, min:299,  desc:'₹75 OFF on orders ≥ ₹299' },
  FREESHIP: { type:'delivery',value:40,            desc:'Free delivery' },
  SAVE100:  { type:'flat',    value:100, min:499,  desc:'₹100 OFF on orders ≥ ₹499' },
  NEWUSER:  { type:'percent', value:30, max:80,    desc:'30% OFF up to ₹80' },
};
const DELIVERY_FEE_BASE = 40;
const GST_RATE = 0.05;

export default function Cart() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { cart } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);

  // Admin cannot access cart
  if (isOwner(user)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: theme.palette.background.default }}>
        <div style={{ fontSize: 56 }}>🚫</div>
        <p className="text-lg font-semibold" style={{ color: theme.palette.text.primary }}>
          Restaurant owners cannot place orders
        </p>
        <button onClick={() => navigate('/admin')}
          className="px-6 py-2.5 rounded-xl text-white font-semibold"
          style={{ backgroundColor: '#ff5722' }}>
          Go to Dashboard
        </button>
      </div>
    );
  }
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(() => { try { const s=localStorage.getItem('appliedCoupon'); return s?JSON.parse(s):null; } catch{ return null; }});
  const [couponErr, setCouponErr] = useState('');
  const [couponOpen, setCouponOpen] = useState(false);

  const itemTotal = cart.reduce((s,i) => s+i.price*i.quantity, 0);
  const { discount, deliveryFee } = useMemo(() => {
    if (!appliedCoupon) return { discount:0, deliveryFee:DELIVERY_FEE_BASE };
    const c = appliedCoupon;
    if (c.type==='percent') return { discount:Math.min(Math.round(itemTotal*c.value/100),c.max), deliveryFee:DELIVERY_FEE_BASE };
    if (c.type==='flat')    return { discount:c.value, deliveryFee:DELIVERY_FEE_BASE };
    if (c.type==='delivery')return { discount:0, deliveryFee:0 };
    return { discount:0, deliveryFee:DELIVERY_FEE_BASE };
  }, [appliedCoupon, itemTotal]);
  const gst = Math.round((itemTotal - discount) * GST_RATE);
  const totalPay = Math.max(0, itemTotal - discount + deliveryFee + gst);

  const applyCoupon = (code) => {
    const key = (code||couponInput).trim().toUpperCase();
    setCouponErr('');
    const c = COUPONS[key];
    if (!c) { setCouponErr('Invalid code. Try WELCOME50, FEAST75, FREESHIP, SAVE100 or NEWUSER.'); return; }
    if (c.min && itemTotal < c.min) { setCouponErr(`Min order ₹${c.min} required.`); return; }
    const applied = { ...c, code:key };
    setAppliedCoupon(applied);
    localStorage.setItem('appliedCoupon', JSON.stringify(applied));
    setCouponInput(''); setCouponOpen(false);
    toast.success(`🎉 "${key}" applied!`);
  };
  const removeCoupon = () => { setAppliedCoupon(null); localStorage.removeItem('appliedCoupon'); toast.info('Coupon removed'); };

  const goCheckout = () => {
    if (!cart.length) return;
    navigate('/checkout');
  };

  // Restore pending coupon from offer click
  useMemo(() => {
    const pending = localStorage.getItem('pendingCoupon');
    if (pending && !appliedCoupon) { localStorage.removeItem('pendingCoupon'); setTimeout(()=>applyCoupon(pending), 300); }
  }, []);

  if (!cart.length) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-5 px-4" style={{ backgroundColor: theme.palette.background.default }}>
      <ShoppingCartOutlinedIcon sx={{ fontSize:'5rem', color: theme.palette.divider }} />
      <p className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>Your cart is empty</p>
      <button onClick={() => navigate('/')} className="px-8 py-3 rounded-xl text-white font-bold" style={{ backgroundColor:'#ff5722' }}>Browse Restaurants</button>
    </div>
  );

  return (
    <div style={{ backgroundColor: theme.palette.background.default, minHeight:'100vh' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-5 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
          <ArrowBackIcon sx={{ fontSize:'1rem' }} /> Continue shopping
        </button>
        <h1 className="text-2xl font-bold mb-6" style={{ color: theme.palette.text.primary }}>
          Your Cart <span className="text-base font-normal ml-2" style={{ color: theme.palette.text.secondary }}>({cart.reduce((s,i)=>s+i.quantity,0)} items)</span>
        </h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
              {cart.map(item => <CartItem key={item.id} item={item} />)}
            </div>
            {/* Coupon */}
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
              {appliedCoupon ? (
                <div className="px-5 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor:'#dcfce7' }}><CheckIcon sx={{ color:'#16a34a', fontSize:'1.1rem' }} /></div>
                  <div className="flex-1"><p className="font-bold text-sm" style={{ color:'#16a34a' }}>"{appliedCoupon.code}" applied!</p><p className="text-xs mt-0.5" style={{ color: theme.palette.text.secondary }}>{appliedCoupon.desc}</p></div>
                  <button onClick={removeCoupon}><CloseIcon sx={{ fontSize:'1rem', color: theme.palette.text.secondary }} /></button>
                </div>
              ) : (
                <button onClick={() => setCouponOpen(o=>!o)} className="w-full px-5 py-4 flex items-center gap-3 text-left">
                  <LocalOfferIcon sx={{ color:'#ff5722' }} />
                  <div className="flex-1"><p className="font-semibold text-sm" style={{ color: theme.palette.text.primary }}>Apply Coupon</p><p className="text-xs mt-0.5" style={{ color: theme.palette.text.secondary }}>Save more with promo codes</p></div>
                  <span className="text-sm font-bold" style={{ color:'#ff5722' }}>{couponOpen?'CLOSE':'VIEW ALL'}</span>
                </button>
              )}
              <Collapse in={couponOpen && !appliedCoupon}>
                <div style={{ borderTop:`1px solid ${theme.palette.divider}` }}>
                  <div className="px-5 py-4 flex gap-3">
                    <input value={couponInput} onChange={e=>{setCouponInput(e.target.value.toUpperCase());setCouponErr('');}} onKeyDown={e=>e.key==='Enter'&&applyCoupon()} placeholder="Enter coupon code" className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none uppercase tracking-widest" style={{ border:`1.5px solid ${couponErr?'#ef4444':theme.palette.divider}`, backgroundColor: theme.palette.mode==='dark'?'#1a1a1a':'#fafafa', color: theme.palette.text.primary }} />
                    <button onClick={()=>applyCoupon()} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ backgroundColor:'#ff5722' }}>APPLY</button>
                  </div>
                  {couponErr && <p className="px-5 pb-3 text-xs text-red-500">{couponErr}</p>}
                  <div className="px-5 pb-4 space-y-2">
                    {Object.entries(COUPONS).map(([code,c]) => {
                      const ok = !c.min || itemTotal>=c.min;
                      return (
                        <div key={code} className="flex items-center gap-3 p-3 rounded-xl" style={{ border:`1.5px dashed ${ok?'#ff5722':theme.palette.divider}`, opacity:ok?1:0.5 }}>
                          <div className="flex-1"><span className="font-bold text-sm font-mono" style={{ color:'#ff5722' }}>{code}</span>{!ok&&c.min&&<span className="ml-2 text-xs" style={{ color: theme.palette.text.secondary }}>Add ₹{c.min-itemTotal} more</span>}<p className="text-xs mt-0.5" style={{ color: theme.palette.text.secondary }}>{c.desc}</p></div>
                          <button disabled={!ok} onClick={()=>ok&&applyCoupon(code)} className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ color:ok?'#ff5722':theme.palette.text.secondary, border:`1.5px solid ${ok?'#ff5722':theme.palette.divider}`, cursor:ok?'pointer':'not-allowed' }}>APPLY</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Collapse>
            </div>
          </div>
          {/* Bill */}
          <div className="lg:w-80 flex-shrink-0 space-y-4">
            <div className="rounded-2xl p-5" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
              <p className="font-bold text-base mb-4" style={{ color: theme.palette.text.primary }}>Bill Summary</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span style={{ color: theme.palette.text.secondary }}>Item Total</span><span>₹{itemTotal.toFixed(2)}</span></div>
                {appliedCoupon && discount>0 && <div className="flex justify-between"><span style={{ color:'#16a34a' }}>Coupon ({appliedCoupon.code})</span><span style={{ color:'#16a34a', fontWeight:700 }}>− ₹{discount.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span style={{ color: theme.palette.text.secondary }}>Delivery Fee</span>{deliveryFee===0?<span style={{ color:'#16a34a', fontWeight:700 }}>FREE</span>:<span>₹{deliveryFee.toFixed(2)}</span>}</div>
                <div className="flex justify-between"><span style={{ color: theme.palette.text.secondary }}>GST (5%)</span><span>₹{gst.toFixed(2)}</span></div>
                {(discount>0||deliveryFee===0) && <div className="flex justify-between text-xs py-1.5 px-2 rounded-lg" style={{ backgroundColor:'#dcfce7' }}><span style={{ color:'#15803d', fontWeight:700 }}>🎉 Total Savings</span><span style={{ color:'#15803d', fontWeight:700 }}>₹{(discount+(deliveryFee===0?DELIVERY_FEE_BASE:0)).toFixed(2)}</span></div>}
              </div>
              <div className="flex justify-between font-bold text-base mt-4 pt-4" style={{ borderTop:`2px dashed ${theme.palette.divider}` }}>
                <span>To Pay</span><span style={{ color:'#ff5722', fontSize:'1.1rem' }}>₹{totalPay.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-1"><SecurityIcon sx={{ fontSize:'1rem', color:'#16a34a' }} /><p className="text-xs" style={{ color: theme.palette.text.secondary }}>100% secure · Powered by Razorpay</p></div>
            <button onClick={goCheckout} className="w-full py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ backgroundColor:'#ff5722' }}>
              <ElectricBoltIcon sx={{ fontSize:'1.2rem' }} />Proceed to Checkout · ₹{totalPay.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
