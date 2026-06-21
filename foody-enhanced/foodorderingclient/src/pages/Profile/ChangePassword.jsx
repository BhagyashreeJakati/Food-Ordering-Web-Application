import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';

export default function ChangePassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [v, setV] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!v.oldPassword) { toast.error('Enter your current password'); return; }
    if (v.newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    if (v.newPassword !== v.confirmPassword) { toast.error('New passwords do not match'); return; }
    if (v.oldPassword === v.newPassword) { toast.error('New password must be different from current'); return; }
    setLoading(true);
    try {
      await api.post('/user/change-password', {
        oldPassword: v.oldPassword,
        newPassword: v.newPassword,
      });
      setDone(true);
      toast.success('Password changed successfully! 🔐');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally { setLoading(false); }
  };

  const inp = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all';
  const inpStyle = {
    backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f8f8f8',
    border: `1.5px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
  };

  return (
    <div className="p-6 lg:p-10 max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
          <ArrowBackIcon sx={{ fontSize: '1rem', color: theme.palette.text.primary }} />
        </button>
        <h1 className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>Change Password</h1>
      </div>

      <div className="rounded-2xl p-6"
        style={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
        {done ? (
          <div className="text-center py-6">
            <div style={{ fontSize: 56 }} className="mb-4">✅</div>
            <p className="text-lg font-bold mb-2" style={{ color: theme.palette.text.primary }}>Password Changed!</p>
            <p className="text-sm mb-6" style={{ color: theme.palette.text.secondary }}>
              A confirmation email has been sent to your inbox.
            </p>
            <button onClick={() => navigate('/profile')}
              className="px-6 py-2.5 rounded-xl text-white font-semibold"
              style={{ backgroundColor: '#ff5722' }}>
              Back to Profile
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl"
              style={{ backgroundColor: '#fff0eb' }}>
              <LockIcon sx={{ color: '#ff5722', fontSize: '1.1rem' }} />
              <p className="text-xs" style={{ color: '#c2410c' }}>
                After changing, you'll receive a security email notification.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold mb-1 block"
                  style={{ color: theme.palette.text.secondary }}>Current password</label>
                <input className={inp} style={inpStyle} type="password" placeholder="Enter current password"
                  value={v.oldPassword} onChange={e => setV({ ...v, oldPassword: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block"
                  style={{ color: theme.palette.text.secondary }}>New password</label>
                <input className={inp} style={inpStyle} type="password" placeholder="Min 6 characters"
                  value={v.newPassword} onChange={e => setV({ ...v, newPassword: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block"
                  style={{ color: theme.palette.text.secondary }}>Confirm new password</label>
                <input className={inp} style={inpStyle} type="password" placeholder="Repeat new password"
                  value={v.confirmPassword} onChange={e => setV({ ...v, confirmPassword: e.target.value })} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold flex items-center justify-center mt-2"
                style={{ backgroundColor: '#ff5722', opacity: loading ? 0.7 : 1 }}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Change Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
