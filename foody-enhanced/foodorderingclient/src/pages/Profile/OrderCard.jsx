import { useTheme } from '@mui/material/styles';
import { Chip } from '@mui/material';

const STATUS_COLOR = { PENDING: '#f59e0b', OUT_FOR_DELIVERY: '#3b82f6', DELIVERED: '#22c55e', COMPLETED: '#22c55e', CANCELLED: '#ef4444' };
const STATUS_BG = { PENDING: '#fef3c7', OUT_FOR_DELIVERY: '#dbeafe', DELIVERED: '#dcfce7', COMPLETED: '#dcfce7', CANCELLED: '#fee2e2' };

export default function OrderCard({ order }) {
  const theme = useTheme();
  if (!order) return null;
  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        <div>
          <p className="font-bold text-sm" style={{ color: theme.palette.text.primary }}>Order #{order.id}</p>
          <p className="text-xs mt-0.5" style={{ color: theme.palette.text.secondary }}>{date}</p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full"
          style={{ backgroundColor: STATUS_BG[order.orderStatus] || '#f3f4f6', color: STATUS_COLOR[order.orderStatus] || '#6b7280' }}>
          {order.orderStatus || 'PENDING'}
        </span>
      </div>

      {/* Items */}
      {order.orderItems?.length > 0 && (
        <div className="px-5 py-4 space-y-3">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <img
                src={item.food?.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'}
                alt={item.food?.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: theme.palette.text.primary }}>{item.food?.name}</p>
                <p className="text-xs" style={{ color: theme.palette.text.secondary }}>Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-sm" style={{ color: theme.palette.text.primary }}>₹{item.totalPrice}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between"
        style={{ backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#fafafa', borderTop: `1px solid ${theme.palette.divider}` }}>
        {order.deliveryAddress && (
          <p className="text-xs" style={{ color: theme.palette.text.secondary }}>
            📍 {order.deliveryAddress.streetAddress}, {order.deliveryAddress.city}
          </p>
        )}
        <p className="font-bold text-base ml-auto" style={{ color: '#ff5722' }}>₹{order.totalPrice}</p>
      </div>
    </div>
  );
}
