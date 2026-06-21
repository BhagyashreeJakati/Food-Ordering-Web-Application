import { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { Select, MenuItem, CircularProgress, Chip } from '@mui/material';
import { toast } from 'react-toastify';
import { MOCK_ADMIN_ORDERS } from '../../utils/mockData';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RefreshIcon from '@mui/icons-material/Refresh';

const STATUS_COLOR = { PENDING: '#f59e0b', OUT_FOR_DELIVERY: '#3b82f6', DELIVERED: '#22c55e', COMPLETED: '#22c55e', CANCELLED: '#ef4444' };
const STATUS_BG    = { PENDING: '#fef3c7', OUT_FOR_DELIVERY: '#dbeafe', DELIVERED: '#dcfce7', COMPLETED: '#dcfce7', CANCELLED: '#fee2e2' };
const ALL_STATUSES = ['PENDING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
const POLL_MS      = 20000;

export default function AdminOrders() {
  const [restaurant] = useOutletContext();
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [updating, setUpdating]   = useState(null);
  const [filter, setFilter]       = useState('ALL');
  const [newCount, setNewCount]   = useState(0);
  const [lastPoll, setLastPoll]   = useState(new Date());
  const prevOrderIds              = useRef(new Set());
  const token = localStorage.getItem('jwtToken');
  const headers = { Authorization: 'Bearer ' + token };

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const r = await axios.get('http://localhost:8080/api/v1/admin/orders/restaurant/' + restaurant.id, { headers });
      const fetched = r.data.payload || [];
      // Also grab mock orders from localStorage so local demo tests work seamlessly
      const foodyOrders = (() => { try { return JSON.parse(localStorage.getItem('foody_mock_orders')) || []; } catch { return []; } })()
        .filter(o => !o.restaurantId || String(o.restaurantId) === String(restaurant.id));
      const combined = [...fetched, ...foodyOrders];
      detectNewOrders(combined);
      setOrders(combined);
    } catch {
      const foodyOrders = (() => { try { return JSON.parse(localStorage.getItem('foody_mock_orders')) || []; } catch { return []; } })()
        .filter(o => !o.restaurantId || String(o.restaurantId) === String(restaurant.id));
      const combined = [...MOCK_ADMIN_ORDERS, ...foodyOrders];
      detectNewOrders(combined);
      setOrders(combined);
    } finally { setLoading(false); setLastPoll(new Date()); }
  };

  const detectNewOrders = (fetched) => {
    if (prevOrderIds.current.size === 0) { fetched.forEach(o => prevOrderIds.current.add(o.id)); return; }
    const newOnes = fetched.filter(o => !prevOrderIds.current.has(o.id));
    if (newOnes.length > 0) {
      setNewCount(c => c + newOnes.length);
      toast.success('🛵 ' + newOnes.length + ' new order(s) received!', { autoClose: 5000 });
      newOnes.forEach(o => prevOrderIds.current.add(o.id));
    }
  };

  useEffect(() => { if (restaurant) fetchOrders(); }, [restaurant]);

  // Auto-poll every 20s
  useEffect(() => {
    if (!restaurant) return;
    const t = setInterval(() => fetchOrders(true), POLL_MS);
    return () => clearInterval(t);
  }, [restaurant]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const res = await axios.put('http://localhost:8080/api/v1/admin/orders/' + id + '/' + status, {}, { headers });
      setOrders(o => o.map(x => x.id === id ? res.data.payload : x));
      toast.success('Status updated to ' + status);
    } catch {
      setOrders(o => o.map(x => x.id === id ? { ...x, orderStatus: status } : x));
      try {
        const mockOrders = JSON.parse(localStorage.getItem('foody_mock_orders')) || [];
        const updatedMock = mockOrders.map(x => String(x.id) === String(id) ? { ...x, orderStatus: status } : x);
        localStorage.setItem('foody_mock_orders', JSON.stringify(updatedMock));
      } catch (e) {}
      toast.success('Status → ' + status + ' (demo)');
    } finally { setUpdating(null); }
  };

  const displayed = filter === 'ALL' ? orders : orders.filter(o => o.orderStatus === filter);
  const counts    = ALL_STATUSES.reduce((acc, s) => { acc[s] = orders.filter(o => o.orderStatus === s).length; return acc; }, {});

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Orders Management</h2>
            {newCount > 0 && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold animate-bounce"
                style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                <NotificationsActiveIcon sx={{ fontSize: '0.8rem' }} />
                {newCount} new
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">{orders.length} total · last polled {lastPoll.toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { fetchOrders(true); setNewCount(0); }}
            className="flex items-center gap-1.5 text-sm text-orange-500 font-semibold hover:underline px-3 py-1.5 rounded-lg border border-orange-200">
            <RefreshIcon sx={{ fontSize: '1rem' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setFilter('ALL')}
          className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
          style={{ backgroundColor: filter === 'ALL' ? '#ff5722' : 'transparent', color: filter === 'ALL' ? '#fff' : '#666', borderColor: filter === 'ALL' ? '#ff5722' : '#e5e7eb' }}>
          All ({orders.length})
        </button>
        {ALL_STATUSES.map(s => counts[s] > 0 && (
          <button key={s} onClick={() => setFilter(s)}
            className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
            style={{
              backgroundColor: filter === s ? STATUS_COLOR[s] : STATUS_BG[s],
              color: STATUS_COLOR[s],
              borderColor: STATUS_COLOR[s] + '60',
            }}>
            {s.replace('_', ' ')} ({counts[s]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><CircularProgress sx={{ color: '#ff5722' }} /></div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><div className="text-5xl mb-3">📋</div><p>No orders</p></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="p-3 border-b">Order ID</th>
                <th className="p-3 border-b">Customer</th>
                <th className="p-3 border-b">Items</th>
                <th className="p-3 border-b">Amount</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Update</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono text-xs text-gray-500">#{order.id}</td>
                  <td className="p-3">
                    <p className="font-medium">{order.customer?.userName || order.customer?.fullName || 'Customer'}</p>
                    <p className="text-xs text-gray-400">{order.customer?.email || ''}</p>
                  </td>
                  <td className="p-3 text-xs text-gray-600 max-w-[180px]">
                    {(order.orderItems || order.items || []).slice(0, 2).map((i, idx) => (
                      <span key={idx} className="block truncate">{i.food?.name || 'Item'} × {i.quantity}</span>
                    ))}
                    {(order.orderItems || order.items || []).length > 2 && <span className="text-gray-400">+{(order.orderItems || order.items).length - 2} more</span>}
                  </td>
                  <td className="p-3 font-semibold">₹{order.totalPrice || order.totalAmount || 0}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: STATUS_BG[order.orderStatus] || '#f3f4f6', color: STATUS_COLOR[order.orderStatus] || '#666' }}>
                      {order.orderStatus?.replace('_', ' ') || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="p-3">
                    {updating === order.id ? (
                      <CircularProgress size={20} sx={{ color: '#ff5722' }} />
                    ) : (
                      <Select
                        size="small"
                        value={order.orderStatus || ''}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        sx={{ fontSize: 12, minWidth: 160, '& .MuiSelect-select': { py: 0.75 } }}
                        disabled={['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(order.orderStatus)}>
                        {ALL_STATUSES.map(s => (
                          <MenuItem key={s} value={s} sx={{ fontSize: 12 }}>
                            {s.replace('_', ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
