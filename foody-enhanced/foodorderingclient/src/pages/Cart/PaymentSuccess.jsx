import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearLocalCart } from '../../redux/slices/cartSlice';
import { useTheme } from '@mui/material/styles';
import api from '../../services/api';
import { getMockOrders, saveMockOrder, generateOrderId } from '../../utils/mockData';
import { toast } from 'react-toastify';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default function PaymentSuccess() {
  const [searchParams]    = useSearchParams();
  const navigate          = useNavigate();
  const dispatch          = useDispatch();
  const theme             = useTheme();

  const paymentId = searchParams.get('razorpay_payment_id') || searchParams.get('payment_id') || 'DEMO_' + Date.now();
  const orderId   = searchParams.get('order_id');
  const isDemo    = searchParams.get('demo') === 'true';

  const [order, setOrder]         = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    dispatch(clearLocalCart());
    localStorage.removeItem('appliedCoupon');
    localStorage.removeItem('pendingCoupon');

    // Find order
    const findOrder = async () => {
      try {
        const res   = await api.get('/orders/user');
        const found = (res.data?.payload || []).find(o => String(o.id) === String(orderId));
        if (found) setOrder(found);
      } catch {
        const mocks = getMockOrders();
        const found = mocks.find(o => String(o.id) === String(orderId));
        if (found) setOrder(found);
      }
    };
    if (orderId) findOrder();

    // Confetti effect
    setTimeout(() => setShowConfetti(true), 200);
    setTimeout(() => setShowConfetti(false), 3500);

    toast.success('🎉 Payment successful! Your order is confirmed.', { autoClose: 5000 });
  }, []);

  const itemTotal = order?.orderItems?.reduce((s, i) => s + (i.totalPrice || 0), 0) || order?.totalPrice || 0;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: theme.palette.background.default }}>

      {/* Confetti dots */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
          {[...Array(30)].map((_, i) => (
            <div key={i}
              className="absolute rounded-full animate-bounce"
              style={{
                width: Math.random() * 8 + 4,
                height: Math.random() * 8 + 4,
                left: Math.random() * 100 + '%',
                top: Math.random() * 60 + '%',
                backgroundColor: ['#ff5722','#22c55e','#3b82f6','#f59e0b','#ec4899'][i % 5],
                animationDelay: Math.random() * 0.5 + 's',
                animationDuration: (Math.random() * 0.5 + 0.5) + 's',
                opacity: showConfetti ? 1 : 0,
                transition: 'opacity 0.5s',
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Success icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#dcfce7' }}>
            <CheckCircleIcon sx={{ fontSize: '2.5rem', color: '#22c55e' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>
            Order Confirmed! 🎉
          </h1>
          <p className="text-sm mt-1" style={{ color: theme.palette.text.secondary }}>
            Your delicious meal is on its way
          </p>
        </div>

        {/* Order details card */}
        <div className="rounded-2xl p-5 mb-4"
          style={{ backgroundColor: theme.palette.background.paper, border: '1px solid ' + theme.palette.divider }}>
          <div className="flex items-center gap-2 mb-4">
            <ReceiptIcon sx={{ fontSize: '1rem', color: '#ff5722' }} />
            <p className="text-sm font-semibold" style={{ color: theme.palette.text.primary }}>Order Details</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: theme.palette.text.secondary }}>Order ID</span>
              <span className="font-mono font-semibold" style={{ color: theme.palette.text.primary }}>#{orderId || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: theme.palette.text.secondary }}>Payment ID</span>
              <span className="font-mono text-xs" style={{ color: theme.palette.text.secondary }}>{paymentId.slice(0, 24)}{paymentId.length > 24 ? '…' : ''}</span>
            </div>
            {isDemo && (
              <div className="flex justify-between">
                <span style={{ color: theme.palette.text.secondary }}>Mode</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>Demo Mode</span>
              </div>
            )}
            <div className="flex justify-between">
              <span style={{ color: theme.palette.text.secondary }}>Status</span>
              <span className="font-semibold" style={{ color: '#22c55e' }}>Paid ✓</span>
            </div>
          </div>

          {/* Items */}
          {order?.orderItems?.length > 0 && (
            <>
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid ' + theme.palette.divider }}>
                <p className="text-xs font-semibold mb-2" style={{ color: theme.palette.text.secondary }}>ITEMS ORDERED</p>
                <div className="space-y-2">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span style={{ color: theme.palette.text.primary }}>{item.food?.name || 'Item'} × {item.quantity}</span>
                      <span style={{ color: theme.palette.text.secondary }}>₹{item.totalPrice || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-3 pt-3 text-sm font-semibold"
                style={{ borderTop: '1px solid ' + theme.palette.divider }}>
                <span style={{ color: theme.palette.text.primary }}>Total Paid</span>
                <span style={{ color: '#ff5722' }}>₹{itemTotal}</span>
              </div>
            </>
          )}
        </div>

        {/* ETA Banner */}
        <div className="rounded-2xl p-4 mb-6 flex items-center gap-3"
          style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
          <span style={{ fontSize: 28 }}>🛵</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#c2410c' }}>Estimated delivery: 25–35 min</p>
            <p className="text-xs" style={{ color: '#ea580c' }}>Track your order for live updates</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          {orderId && (
            <button onClick={() => navigate('/orders/track/' + orderId)}
              className="w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2"
              style={{ backgroundColor: '#ff5722' }}>
              <TrackChangesIcon sx={{ fontSize: '1.1rem' }} />
              Track My Order
            </button>
          )}
          <button onClick={() => navigate('/')}
            className="w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, border: '1px solid ' + theme.palette.divider }}>
            <HomeIcon sx={{ fontSize: '1.1rem' }} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
