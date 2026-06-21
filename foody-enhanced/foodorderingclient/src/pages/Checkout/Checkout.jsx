import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearLocalCart } from '../../redux/slices/cartSlice';
import { useTheme } from '@mui/material/styles';
import { CircularProgress, Grid, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { saveMockOrder, generateOrderId } from '../../utils/mockData';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import EditIcon from '@mui/icons-material/Edit';

const DELIVERY=40, GST=0.05;
const addrSchema = Yup.object({ streetAddress:Yup.string().required('Required'), city:Yup.string().required('Required'), state:Yup.string().required('Required'), pincode:Yup.string().matches(/^\d{6}$/,'6-digit pincode').required('Required') });

export default function Checkout() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector(s => s.cart);
  const { restaurant } = useSelector(s => s.restaurants);
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState(null);
  const [placing, setPlacing] = useState(false);

  const coupon = useMemo(() => { try { return JSON.parse(localStorage.getItem('appliedCoupon')); } catch { return null; } }, []);
  const itemTotal = cart.reduce((s,i) => s+i.price*i.quantity, 0);
  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.type==='percent') return Math.min(Math.round(itemTotal*coupon.value/100),coupon.max||9999);
    if (coupon.type==='flat') return coupon.value;
    return 0;
  }, [coupon, itemTotal]);
  const delivery = coupon?.type==='delivery' ? 0 : DELIVERY;
  const gst = Math.round((itemTotal-discount)*GST);
  const total = Math.max(0, itemTotal-discount+delivery+gst);

  if (!cart.length && !placing) { navigate('/'); return null; }
  if (placing) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6" style={{ backgroundColor: theme.palette.background.default }}>
      <CircularProgress sx={{ color:'#ff5722' }} size={60} />
      <p className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>Placing your order…</p>
      <p style={{ color: theme.palette.text.secondary }}>Please wait, don't close this page</p>
    </div>
  );

  const STEPS = ['Delivery Address','Review Order','Payment'];
  const StepBar = () => (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((label,i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all" style={{ backgroundColor:i<step?'#22c55e':i===step?'#ff5722':theme.palette.divider, color:i<=step?'#fff':theme.palette.text.secondary, boxShadow:i===step?'0 0 0 4px rgba(255,87,34,.2)':'' }}>
              {i<step?'✓':i+1}
            </div>
            <p className="text-xs mt-1 font-medium" style={{ color:i===step?'#ff5722':i<step?'#22c55e':theme.palette.text.secondary }}>{label}</p>
          </div>
          {i<STEPS.length-1 && <div className="w-16 lg:w-24 h-0.5 mx-2 mb-5" style={{ backgroundColor:i<step?'#22c55e':theme.palette.divider }} />}
        </div>
      ))}
    </div>
  );

  const BillSide = () => (
    <div className="space-y-4">
      <div className="rounded-2xl p-4" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
        <p className="font-bold text-sm mb-3" style={{ color: theme.palette.text.primary }}>Order Summary</p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-2">
              <img src={item.images?.[0]||'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&q=80'} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate" style={{ color: theme.palette.text.primary }}>{item.name}</p><p className="text-xs" style={{ color: theme.palette.text.secondary }}>×{item.quantity}</p></div>
              <p className="text-xs font-bold">₹{(item.price*item.quantity).toFixed(0)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl p-4" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
        <p className="font-bold text-sm mb-3">Bill Details</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span style={{ color: theme.palette.text.secondary }}>Items</span><span>₹{itemTotal.toFixed(2)}</span></div>
          {coupon&&discount>0&&<div className="flex justify-between"><span style={{ color:'#22c55e' }}>Coupon ({coupon.code})</span><span style={{ color:'#22c55e', fontWeight:700 }}>−₹{discount.toFixed(2)}</span></div>}
          <div className="flex justify-between"><span style={{ color: theme.palette.text.secondary }}>Delivery</span>{delivery===0?<span style={{ color:'#22c55e', fontWeight:700 }}>FREE</span>:<span>₹{delivery}</span>}</div>
          <div className="flex justify-between"><span style={{ color: theme.palette.text.secondary }}>GST</span><span>₹{gst.toFixed(2)}</span></div>
        </div>
        <div className="flex justify-between font-bold text-base mt-3 pt-3" style={{ borderTop:`2px dashed ${theme.palette.divider}` }}>
          <span>Total</span><span style={{ color:'#ff5722' }}>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  const placeOrder = async () => {
    setPlacing(true);
    try {
      // Try real backend first
      const currentRestaurantId = restaurant?.id || cart[0]?.restaurant?.id || cart[0]?.restaurantId || 1;
      let orderId = null;
      try {
        // Sync local cart to backend before placing order
        await api.put('/cart/clear').catch(() => {});
        for (const item of cart) {
          await api.put('/cart/add', { foodId: item.id, quantity: item.quantity, ingredients: [] });
        }

        const orderRes = await api.post('/orders', { restaurantId: currentRestaurantId, deliveryAddress: address });
        orderId = orderRes.data?.payload?.id;
        if (orderId) {
          const payRes = await api.post(`/payments/${orderId}`);
          const url = payRes.data?.payment_url;
          if (url) { dispatch(clearLocalCart()); localStorage.removeItem('appliedCoupon'); toast.success('Order placed! Redirecting to payment…'); setTimeout(() => window.location.href = url, 900); return; }
        }
      } catch (err) {
        console.error('Backend real order failed', err);
      }

      if (!orderId) {
        await new Promise(r => setTimeout(r, 1800));
        const mockOrder = {
          id: generateOrderId(),
          orderStatus: 'PENDING',
          createdAt: new Date().toISOString(),
          totalAmount: total,
          deliveryAddress: address,
          items: cart.map(i => ({ food: { name: i.name, images: i.images }, quantity: i.quantity, totalPrice: i.price * i.quantity })),
          restaurantId: currentRestaurantId,
        };
        saveMockOrder(mockOrder);
        dispatch(clearLocalCart());
        localStorage.removeItem('appliedCoupon');
        toast.success('🎉 Order placed successfully!');
        setTimeout(() => navigate(`/orders/track/${mockOrder.id}`), 800);
      }
    } catch(e) {
      toast.error('Checkout failed. Please try again.');
      setPlacing(false);
    }
  };

  return (
    <div style={{ backgroundColor: theme.palette.background.default, minHeight:'100vh' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => step===0 ? navigate('/cart') : setStep(s=>s-1)} className="flex items-center gap-2 mb-6 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
          <ArrowBackIcon sx={{ fontSize:'1rem' }} />{step===0?'Back to Cart':'Back'}
        </button>
        <StepBar />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {/* STEP 0 */}
            {step===0 && (
              <div className="rounded-2xl p-6" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
                <div className="flex items-center gap-2 mb-5"><LocationOnIcon sx={{ color:'#ff5722' }} /><h2 className="text-lg font-bold">Delivery Address</h2></div>
                <Formik initialValues={address||{streetAddress:'',city:'',state:'',pincode:'',landmark:''}} validationSchema={addrSchema} onSubmit={v=>{setAddress(v);setStep(1);}}>
                  {({errors,touched})=>(
                    <Form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[{n:'streetAddress',l:'Street Address *',p:'House no, area',col:2},{n:'landmark',l:'Landmark (optional)',p:'Near mall/school',col:2},{n:'city',l:'City *',p:'Mumbai',col:1},{n:'state',l:'State *',p:'Maharashtra',col:1},{n:'pincode',l:'Pincode *',p:'400001',col:1}].map(f=>(
                          <div key={f.n} className={f.col===2?'md:col-span-2':''}>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.palette.text.secondary }}>{f.l}</label>
                            <Field name={f.n}>{({field})=>(
                              <input {...field} placeholder={f.p} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ backgroundColor: theme.palette.mode==='dark'?'#1a1a1a':'#fafafa', border:`1.5px solid ${touched[f.n]&&errors[f.n]?'#ef4444':theme.palette.divider}`, color: theme.palette.text.primary }} />
                            )}</Field>
                            {touched[f.n]&&errors[f.n]&&<p className="text-xs text-red-500 mt-1">{errors[f.n]}</p>}
                          </div>
                        ))}
                      </div>
                      <button type="submit" className="w-full py-3.5 rounded-xl text-white font-bold text-base" style={{ backgroundColor:'#ff5722' }}>Continue to Review →</button>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
            {/* STEP 1 */}
            {step===1 && (
              <div className="space-y-4">
                <div className="rounded-2xl p-5 flex items-start gap-3" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
                  <CheckCircleIcon sx={{ color:'#22c55e', mt:0.3 }} />
                  <div className="flex-1">
                    <p className="font-bold text-sm mb-1">Delivering to</p>
                    <p className="text-sm" style={{ color: theme.palette.text.secondary }}>{address?.streetAddress}{address?.landmark?`, ${address.landmark}`:''}</p>
                    <p className="text-sm" style={{ color: theme.palette.text.secondary }}>{address?.city}, {address?.state} – {address?.pincode}</p>
                  </div>
                  <button onClick={()=>setStep(0)} className="flex items-center gap-1 text-xs font-semibold" style={{ color:'#ff5722' }}><EditIcon sx={{ fontSize:'.9rem' }} /> Edit</button>
                </div>
                <div className="rounded-2xl p-5" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
                  <p className="font-bold text-sm mb-4">Your Items</p>
                  {cart.map(item=>(
                    <div key={item.id} className="flex items-center gap-4 mb-4">
                      <img src={item.images?.[0]||'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div className="flex-1"><p className="font-semibold text-sm">{item.name}</p><p className="text-xs" style={{ color: theme.palette.text.secondary }}>₹{item.price} × {item.quantity}</p></div>
                      <p className="font-bold text-sm">₹{(item.price*item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setStep(2)} className="w-full py-3.5 rounded-xl text-white font-bold text-base" style={{ backgroundColor:'#ff5722' }}>Continue to Payment →</button>
              </div>
            )}
            {/* STEP 2 */}
            {step===2 && (
              <div className="space-y-4">
                <div className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
                  <LocationOnIcon sx={{ color:'#ff5722', fontSize:'1.1rem' }} />
                  <div className="flex-1"><p className="text-xs font-bold" style={{ color: theme.palette.text.secondary }}>DELIVERING TO</p><p className="text-sm font-medium mt-0.5">{address?.streetAddress}, {address?.city} – {address?.pincode}</p></div>
                  <button onClick={()=>setStep(0)} className="text-xs font-bold" style={{ color:'#ff5722' }}>CHANGE</button>
                </div>
                <div className="rounded-2xl p-5" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
                  <p className="font-bold text-sm mb-4">Payment Method</p>
                  <div className="flex items-center gap-4 p-4 rounded-xl" style={{ border:`2px solid #ff5722`, backgroundColor:'#fff3e0' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor:'#ff5722' }}><div className="w-2 h-2 rounded-full bg-white" /></div>
                    <div className="flex-1"><p className="font-bold text-sm" style={{ color:'#ff5722' }}>Razorpay Secure Checkout</p><p className="text-xs mt-0.5" style={{ color:'#9a3412' }}>UPI · Cards · Net Banking · Wallets</p></div>
                    <span className="text-2xl">💳</span>
                  </div>
                  <div className="mt-4 p-3 rounded-xl text-xs" style={{ backgroundColor: theme.palette.mode==='dark'?'#1a1a1a':'#f8f8f8' }}>
                    <p className="font-bold mb-1">🧪 Test Payment Card</p>
                    <p style={{ color: theme.palette.text.secondary }}>Card: <strong>4111 1111 1111 1111</strong> · Expiry: any future date · CVV: any 3 digits</p>
                  </div>
                </div>
                <button onClick={placeOrder} disabled={placing} className="w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3" style={{ backgroundColor:'#ff5722', opacity:placing?0.7:1 }}>
                  {placing?<><CircularProgress size={22} color="inherit" /> Placing…</>:<><ElectricBoltIcon /> Pay ₹{total.toFixed(2)} · Place Order</>}
                </button>
              </div>
            )}
          </div>
          <div className="lg:w-80 flex-shrink-0"><BillSide /></div>
        </div>
      </div>
    </div>
  );
}
