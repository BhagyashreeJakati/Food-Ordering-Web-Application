import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { CircularProgress, LinearProgress } from '@mui/material';
import api from '../../services/api';
import { getMockOrders } from '../../utils/mockData';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const STEPS = [
  { key: 'ORDER_PLACED',     label: 'Order Placed',   icon: '📋', desc: 'Your order has been received by our system.' },
  { key: 'PENDING',          label: 'Confirming',     icon: '⏳', desc: 'Restaurant is reviewing and confirming your order.' },
  { key: 'PREPARING',        label: 'Preparing',      icon: '👨‍🍳', desc: 'Your food is being freshly prepared with care.' },
  { key: 'OUT_FOR_DELIVERY', label: 'On the Way',     icon: '🛵', desc: 'Your order is out for delivery. Almost there!' },
  { key: 'DELIVERED',        label: 'Delivered',      icon: '🎉', desc: 'Enjoy your meal! Rate your experience below.' },
];

const STATUS_MAP  = { PENDING: 1, OUT_FOR_DELIVERY: 3, DELIVERED: 4, COMPLETED: 4, CANCELLED: -1 };
const ETA_MAP     = { PENDING: '25–35 min', OUT_FOR_DELIVERY: '10–15 min', DELIVERED: 'Delivered!', COMPLETED: 'Delivered!' };
const COLOR_MAP   = { PENDING: '#f59e0b', OUT_FOR_DELIVERY: '#3b82f6', DELIVERED: '#22c55e', COMPLETED: '#22c55e', CANCELLED: '#ef4444' };
const POLL_INTERVAL = 15000;

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [order, setOrder]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing]   = useState(false);
  const [countdown, setCountdown]     = useState(POLL_INTERVAL / 1000);
  const [showRating, setShowRating]   = useState(false);
  const [rating, setRating]           = useState(0);
  const prevStatusRef                 = useRef(null);

  const fetchOrder = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const res   = await api.get('/orders/user');
      const found = (res.data?.payload || []).find(o => String(o.id) === String(orderId));
      if (found) {
        if (prevStatusRef.current && prevStatusRef.current !== found.orderStatus) {
          const step = STEPS.find(s => s.key === found.orderStatus);
          toast.info('🔔 Order update: ' + (step?.label || found.orderStatus), { autoClose: 4000 });
        }
        prevStatusRef.current = found.orderStatus;
        setOrder(found);
        setLastUpdated(new Date());
      } else {
        const mock = getMockOrders().find(o => String(o.id) === String(orderId));
        if (mock) { setOrder(mock); setLastUpdated(new Date()); }
      }
    } catch {
      const mock = getMockOrders().find(o => String(o.id) === String(orderId));
      if (mock) { setOrder(mock); setLastUpdated(new Date()); }
    } finally { setLoading(false); setRefreshing(false); }
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  useEffect(() => {
    if (!order) return;
    if (['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(order.orderStatus)) {
      if (order.orderStatus === 'DELIVERED' || order.orderStatus === 'COMPLETED') {
        setTimeout(() => setShowRating(true), 1500);
      }
      return;
    }
    const pollTimer = setInterval(() => fetchOrder(true), POLL_INTERVAL);
    const cdTimer   = setInterval(() => setCountdown(c => c <= 1 ? POLL_INTERVAL / 1000 : c - 1), 1000);
    setCountdown(POLL_INTERVAL / 1000);
    return () => { clearInterval(pollTimer); clearInterval(cdTimer); };
  }, [order?.orderStatus, fetchOrder]);

  const cancelOrder = async () => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await api.delete('/orders/' + orderId + '/cancel');
      fetchOrder(true);
      toast.success('Order cancelled.');
    } catch {
      setOrder(o => ({ ...o, orderStatus: 'CANCELLED' }));
      toast.success('Order cancelled (demo).');
    }
  };

  const stepIndex   = order ? (STATUS_MAP[order.orderStatus] ?? 0) : 0;
  const isCancelled = order?.orderStatus === 'CANCELLED';
  const isDone      = order?.orderStatus === 'DELIVERED' || order?.orderStatus === 'COMPLETED';
  const accentColor = order ? (COLOR_MAP[order.orderStatus] || '#ff5722') : '#ff5722';
  const eta         = order ? (ETA_MAP[order.orderStatus] || '—') : '—';

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: theme.palette.background.default }}>
      <CircularProgress sx={{ color: '#ff5722' }} size={52} />
      <p style={{ color: theme.palette.text.secondary, fontSize: 14 }}>Loading your order…</p>
    </div>
  );

  if (!order) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: theme.palette.background.default }}>
      <div style={{ fontSize: 56 }}>🔍</div>
      <p className="font-semibold" style={{ color: theme.palette.text.primary }}>Order #{orderId} not found</p>
      <button onClick={() => navigate('/profile/orders')}
        className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
        style={{ backgroundColor: '#ff5722' }}>
        View All Orders
      </button>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.palette.background.default }}>
      {!isDone && !isCancelled && (
        <LinearProgress variant="determinate"
          value={(1 - countdown / (POLL_INTERVAL / 1000)) * 100}
          sx={{ height: 2, '& .MuiLinearProgress-bar': { backgroundColor: accentColor }, backgroundColor: 'transparent' }} />
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme.palette.background.paper, border: '1px solid ' + theme.palette.divider }}>
            <ArrowBackIcon sx={{ fontSize: '1.1rem', color: theme.palette.text.primary }} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: theme.palette.text.primary }}>Order #{orderId}</h1>
            <p className="text-xs" style={{ color: theme.palette.text.secondary }}>{order.restaurant?.name || 'Restaurant'}</p>
          </div>
          {!isDone && !isCancelled && (
            <button onClick={() => fetchOrder(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.secondary, border: '1px solid ' + theme.palette.divider }}>
              <RefreshIcon sx={{ fontSize: '0.9rem', animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              {refreshing ? 'Refreshing…' : 'Refresh (' + countdown + 's)'}
            </button>
          )}
        </div>

        {/* Status Hero Card */}
        <div className="rounded-2xl p-5 mb-4 relative overflow-hidden"
          style={{ backgroundColor: isDark ? theme.palette.background.paper : accentColor + '12', border: '1.5px solid ' + accentColor + '40' }}>
          {!isDone && !isCancelled && (
            <span className="absolute top-4 right-4 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: accentColor }} />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: accentColor }} />
            </span>
          )}
          <div className="flex items-start gap-4">
            <div style={{ fontSize: 40 }}>{isCancelled ? '❌' : STEPS[Math.min(stepIndex, STEPS.length - 1)]?.icon}</div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: accentColor }}>
                {isCancelled ? 'Cancelled' : 'Current status'}
              </p>
              <p className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>
                {isCancelled ? 'Order Cancelled' : STEPS[Math.min(stepIndex, STEPS.length - 1)]?.label}
              </p>
              <p className="text-sm mt-1" style={{ color: theme.palette.text.secondary }}>
                {isCancelled
                  ? 'Your order has been cancelled. Refund (if any) will be processed in 5–7 days.'
                  : STEPS[Math.min(stepIndex, STEPS.length - 1)]?.desc}
              </p>
              {!isCancelled && (
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <AccessTimeIcon sx={{ fontSize: '1rem', color: accentColor }} />
                    <span className="text-sm font-semibold" style={{ color: theme.palette.text.primary }}>{eta}</span>
                  </div>
                  {order.deliveryAddress && (
                    <div className="flex items-center gap-1.5">
                      <LocationOnIcon sx={{ fontSize: '1rem', color: theme.palette.text.secondary }} />
                      <span className="text-xs" style={{ color: theme.palette.text.secondary }}>
                        {order.deliveryAddress.streetAddress || order.deliveryAddress.street}, {order.deliveryAddress.city}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        {!isCancelled && (
          <div className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: theme.palette.background.paper, border: '1px solid ' + theme.palette.divider }}>
            <p className="text-sm font-semibold mb-4" style={{ color: theme.palette.text.primary }}>Order Timeline</p>
            <div>
              {STEPS.map((step, i) => {
                const done = i <= stepIndex;
                const active = i === stepIndex;
                const isLast = i === STEPS.length - 1;
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: done ? (active ? accentColor : '#22c55e') : theme.palette.background.default,
                          border: done ? 'none' : '2px solid ' + theme.palette.divider,
                          boxShadow: active ? '0 0 0 4px ' + accentColor + '25' : 'none',
                          transition: 'all 0.3s',
                        }}>
                        {done
                          ? (active
                            ? <span style={{ fontSize: 16 }}>{step.icon}</span>
                            : <CheckCircleIcon sx={{ fontSize: '1.1rem', color: '#fff' }} />)
                          : <span style={{ fontSize: 14, opacity: 0.3 }}>{step.icon}</span>
                        }
                      </div>
                      {!isLast && (
                        <div className="w-0.5 h-8 mt-1"
                          style={{ backgroundColor: i < stepIndex ? '#22c55e' : theme.palette.divider, transition: 'background-color 0.3s' }} />
                      )}
                    </div>
                    <div className="pb-6 flex-1">
                      <p className="text-sm font-semibold" style={{ color: done ? theme.palette.text.primary : theme.palette.text.secondary }}>
                        {step.label}
                        {active && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-normal"
                            style={{ backgroundColor: accentColor + '20', color: accentColor }}>
                            Now
                          </span>
                        )}
                      </p>
                      {active && <p className="text-xs mt-0.5" style={{ color: theme.palette.text.secondary }}>{step.desc}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Items */}
        {order.orderItems?.length > 0 && (
          <div className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: theme.palette.background.paper, border: '1px solid ' + theme.palette.divider }}>
            <p className="text-sm font-semibold mb-3" style={{ color: theme.palette.text.primary }}>
              Your Items ({order.orderItems.length})
            </p>
            <div className="space-y-3">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img
                    src={item.food?.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&q=80'}
                    alt={item.food?.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: theme.palette.text.primary }}>{item.food?.name || 'Item'}</p>
                    <p className="text-xs" style={{ color: theme.palette.text.secondary }}>Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: theme.palette.text.primary }}>
                    ₹{item.totalPrice || 0}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid ' + theme.palette.divider }}>
              <div className="flex justify-between">
                <span className="text-sm font-semibold" style={{ color: theme.palette.text.primary }}>Total Paid</span>
                <span className="text-sm font-bold" style={{ color: '#ff5722' }}>
                  ₹{order.totalPrice || order.orderItems.reduce((s, i) => s + (i.totalPrice || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Rating — after delivery */}
        {showRating && (
          <div className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: theme.palette.background.paper, border: '1.5px solid #22c55e40' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: theme.palette.text.primary }}>⭐ Rate your experience</p>
            <div className="flex gap-2 mb-3">
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setRating(star)}
                  style={{ fontSize: 28, opacity: star <= rating ? 1 : 0.3, transition: 'opacity 0.2s' }}>
                  ⭐
                </button>
              ))}
            </div>
            {rating > 0 && (
              <button onClick={() => { toast.success('Thanks for your feedback! 🙏'); setShowRating(false); }}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: '#22c55e' }}>
                Submit Rating
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {order.orderStatus === 'PENDING' && (
            <button onClick={cancelOrder}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold"
              style={{ color: '#ef4444', border: '1.5px solid #ef4444', backgroundColor: 'transparent' }}>
              Cancel Order
            </button>
          )}
          <button onClick={() => toast.info('Support coming soon!')}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.secondary, border: '1px solid ' + theme.palette.divider }}>
            <SupportAgentIcon sx={{ fontSize: '1rem' }} />
            Need Help?
          </button>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: theme.palette.text.secondary }}>
          Last updated: {lastUpdated.toLocaleTimeString()}
          {!isDone && !isCancelled && ' · Next check in ' + countdown + 's'}
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
