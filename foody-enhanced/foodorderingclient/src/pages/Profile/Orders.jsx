import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import api from '../../services/api';
import { getMockOrders, cancelMockOrder } from '../../utils/mockData';
import { toast } from 'react-toastify';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import RefreshIcon from '@mui/icons-material/Refresh';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const STATUS_META = {
  PENDING:          { label:'Confirming', bg:'#fef3c7', color:'#92400e' },
  OUT_FOR_DELIVERY: { label:'On the Way 🛵', bg:'#dbeafe', color:'#1e40af' },
  DELIVERED:        { label:'Delivered ✅', bg:'#dcfce7', color:'#15803d' },
  COMPLETED:        { label:'Completed ✅', bg:'#dcfce7', color:'#15803d' },
  CANCELLED:        { label:'Cancelled', bg:'#fee2e2', color:'#991b1b' },
};

export default function Orders() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/user');
      const apiOrders = res.data?.payload || [];
      const mockOrders = getMockOrders();
      // Merge: API orders take priority, append mock-only ones
      const merged = [...apiOrders, ...mockOrders.filter(m => !apiOrders.find(a => String(a.id) === String(m.id)))];
      setOrders(merged.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)));
    } catch {
      // Backend offline — show only mock orders
      setOrders(getMockOrders().sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)));
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm(`Cancel order #${orderId}?`)) return;
    setCancelling(orderId);
    try {
      await api.delete(`/orders/${orderId}/cancel`);
      toast.success(`Order #${orderId} cancelled`);
      setOrders(prev => prev.map(o => o.id===orderId ? {...o, orderStatus:'CANCELLED'} : o));
    } catch {
      // Mock cancel
      const updated = cancelMockOrder(orderId);
      setOrders(updated.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)));
      toast.success(`Order #${orderId} cancelled`);
    } finally { setCancelling(null); }
  };

  const filtered = orders.filter(o => {
    if (filter==='active') return ['PENDING','OUT_FOR_DELIVERY'].includes(o.orderStatus);
    if (filter==='delivered') return ['DELIVERED','COMPLETED'].includes(o.orderStatus);
    return true;
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>My Orders</h1>
        <button onClick={fetchOrders} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color:'#ff5722' }}>
          <RefreshIcon sx={{ fontSize:'1rem' }} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[['all','All'],['active','Active'],['delivered','Delivered']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={{ backgroundColor:filter===v?'#ff5722':'transparent', color:filter===v?'#fff':theme.palette.text.secondary, border:`1.5px solid ${filter===v?'#ff5722':theme.palette.divider}` }}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><CircularProgress sx={{ color:'#ff5722' }} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🛍️</div>
          <p className="text-xl font-bold mb-2" style={{ color: theme.palette.text.primary }}>No orders yet</p>
          <p className="text-sm mb-6" style={{ color: theme.palette.text.secondary }}>Your order history will appear here</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl text-white font-bold" style={{ backgroundColor:'#ff5722' }}>Browse Restaurants</button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
            const meta = STATUS_META[order.orderStatus] || { label: order.orderStatus, bg:'#f3f4f6', color:'#374151' };
            const canCancel = ['PENDING'].includes(order.orderStatus);
            return (
              <div key={order.id} className="rounded-2xl p-5" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-bold text-base" style={{ color: theme.palette.text.primary }}>Order #{order.id}</p>
                    <p className="text-xs mt-0.5" style={{ color: theme.palette.text.secondary }}>{new Date(order.createdAt).toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: meta.bg, color: meta.color }}>{meta.label}</span>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {(order.items||[]).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.food?.images?.[0] && <img src={item.food.images[0]} alt={item.food?.name} className="w-10 h-10 rounded-lg object-cover" />}
                      <p className="text-sm flex-1" style={{ color: theme.palette.text.secondary }}>{item.food?.name} × {item.quantity}</p>
                      <p className="text-sm font-semibold">₹{item.totalPrice}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3" style={{ borderTop:`1px dashed ${theme.palette.divider}` }}>
                  <p className="font-bold text-base" style={{ color: theme.palette.text.primary }}>Total: ₹{order.totalAmount?.toFixed?.(2) ?? order.totalAmount}</p>
                  <div className="flex gap-2">
                    {canCancel && (
                      <button onClick={() => handleCancel(order.id)} disabled={cancelling===order.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ border:`1.5px solid #ef4444`, color:'#ef4444' }}>
                        {cancelling===order.id ? <CircularProgress size={12} /> : <CancelOutlinedIcon sx={{ fontSize:'.9rem' }} />} Cancel
                      </button>
                    )}
                    <button onClick={() => navigate(`/orders/track/${order.id}`)} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor:'#ff5722' }}>
                      <TrackChangesIcon sx={{ fontSize:'.9rem' }} /> Track
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
