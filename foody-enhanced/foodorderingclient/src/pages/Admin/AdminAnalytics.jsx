import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import LocalMallIcon from '@mui/icons-material/LocalMall';

const STATUS_COLORS = {
  PENDING: '#f59e0b', OUT_FOR_DELIVERY: '#3b82f6',
  DELIVERED: '#22c55e', COMPLETED: '#22c55e', CANCELLED: '#ef4444',
};

export default function AdminAnalytics() {
  const [restaurant] = useOutletContext();
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    if (!restaurant) return;
    axios.get(`http://localhost:8080/api/v1/admin/orders/restaurant/${restaurant.id}`,
      { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setOrders(r.data.payload || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [restaurant]);

  if (loading) return <div className="flex justify-center py-20"><CircularProgress sx={{ color: '#ff5722' }} /></div>;

  const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const uniqueCustomers = new Set(orders.map(o => o.customer?.id).filter(Boolean)).size;
  const avgOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  // Status breakdown
  const statusCount = orders.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {});

  // Top food items
  const itemCount = {};
  orders.forEach(o => o.orderItems?.forEach(i => {
    const name = i.food?.name || 'Unknown';
    itemCount[name] = (itemCount[name] || 0) + i.quantity;
  }));
  const topItems = Object.entries(itemCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Revenue by day (last 7 days)
  const dayRevenue = {};
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    dayRevenue[d.toLocaleDateString('en-IN', { weekday: 'short' })] = 0;
  }
  orders.forEach(o => {
    if (!o.createdAt) return;
    const d = new Date(o.createdAt);
    const key = d.toLocaleDateString('en-IN', { weekday: 'short' });
    if (key in dayRevenue) dayRevenue[key] += (o.totalPrice || 0);
  });
  const maxRevenue = Math.max(...Object.values(dayRevenue), 1);

  const metrics = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <TrendingUpIcon />, color: '#ff5722' },
    { label: 'Total Orders', value: orders.length, icon: <ReceiptLongIcon />, color: '#3b82f6' },
    { label: 'Unique Customers', value: uniqueCustomers, icon: <PeopleOutlineIcon />, color: '#22c55e' },
    { label: 'Avg. Order Value', value: `₹${avgOrder}`, icon: <LocalMallIcon />, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>Analytics Overview</h2>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="rounded-2xl p-5 bg-white shadow-sm"
            style={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.palette.text.secondary }}>{m.label}</span>
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue bar chart */}
        <div className="rounded-2xl p-5"
          style={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
          <p className="font-bold text-sm mb-5" style={{ color: theme.palette.text.primary }}>Revenue — Last 7 Days</p>
          {Object.entries(dayRevenue).length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: theme.palette.text.secondary }}>No revenue data yet</p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {Object.entries(dayRevenue).map(([day, rev]) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-xs font-bold" style={{ color: '#ff5722' }}>
                    {rev > 0 ? `₹${rev}` : ''}
                  </p>
                  <div className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${Math.max(4, (rev / maxRevenue) * 120)}px`,
                      backgroundColor: rev > 0 ? '#ff5722' : (theme.palette.mode === 'dark' ? '#2a2a2a' : '#f3f4f6'),
                    }} />
                  <p className="text-xs" style={{ color: theme.palette.text.secondary }}>{day}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order status breakdown */}
        <div className="rounded-2xl p-5"
          style={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
          <p className="font-bold text-sm mb-5" style={{ color: theme.palette.text.primary }}>Order Status Breakdown</p>
          {Object.keys(statusCount).length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: theme.palette.text.secondary }}>No orders yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(statusCount).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: theme.palette.text.secondary }}>{status}</span>
                    <span style={{ color: STATUS_COLORS[status] || '#888', fontWeight: 700 }}>{count} orders</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f3f4f6' }}>
                    <div className="h-2 rounded-full transition-all"
                      style={{ width: `${(count / orders.length) * 100}%`, backgroundColor: STATUS_COLORS[status] || '#888' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top selling items */}
        <div className="rounded-2xl p-5 lg:col-span-2"
          style={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
          <p className="font-bold text-sm mb-4" style={{ color: theme.palette.text.primary }}>Top Selling Items</p>
          {topItems.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: theme.palette.text.secondary }}>No sales data yet</p>
          ) : (
            <div className="space-y-3">
              {topItems.map(([name, count], i) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: i === 0 ? '#ff5722' : (theme.palette.mode === 'dark' ? '#2a2a2a' : '#f3f4f6'), color: i === 0 ? '#fff' : theme.palette.text.secondary }}>
                    {i + 1}
                  </div>
                  <p className="flex-1 text-sm font-medium" style={{ color: theme.palette.text.primary }}>{name}</p>
                  <span className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#fff3e0', color: '#ff5722' }}>
                    {count} sold
                  </span>
                  <div className="w-24 h-2 rounded-full" style={{ backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f3f4f6' }}>
                    <div className="h-2 rounded-full" style={{ width: `${(count / topItems[0][1]) * 100}%`, backgroundColor: '#ff5722' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
