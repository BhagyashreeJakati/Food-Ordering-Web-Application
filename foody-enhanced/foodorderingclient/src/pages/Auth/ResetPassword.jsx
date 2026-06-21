import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [v, setV] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (v.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (v.newPassword !== v.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (!token) { toast.error('Invalid reset link'); return; }
    setLoading(true);
    try {
      await api.post('/user/reset-password', { token, newPassword: v.newPassword });
      setDone(true);
      toast.success('Password reset successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Reset link is invalid or expired.');
    } finally { setLoading(false); }
  };

  const inp = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all';
  const inpStyle = {
    backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f8f8f8',
    border: `1.5px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: theme.palette.background.default }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl p-8"
          style={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#dcfce7' }}>
              <span style={{ fontSize: 28 }}>🔑</span>
            </div>
            <h2 className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>Set new password</h2>
            <p className="text-sm mt-2" style={{ color: theme.palette.text.secondary }}>Must be at least 6 characters</p>
          </div>
          {done ? (
            <div className="text-center">
              <div style={{ fontSize: 48 }} className="mb-4">✅</div>
              <p className="font-semibold mb-2" style={{ color: theme.palette.text.primary }}>Password reset!</p>
              <p className="text-sm mb-6" style={{ color: theme.palette.text.secondary }}>
                You can now login with your new password.
              </p>
              <button onClick={() => navigate('/account/login')}
                className="w-full py-3 rounded-xl text-white font-semibold"
                style={{ backgroundColor: '#ff5722' }}>
                Login Now
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold mb-1 block"
                  style={{ color: theme.palette.text.secondary }}>New password</label>
                <input className={inp} style={inpStyle} type="password" placeholder="Min 6 characters"
                  value={v.newPassword} onChange={e => setV({ ...v, newPassword: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block"
                  style={{ color: theme.palette.text.secondary }}>Confirm new password</label>
                <input className={inp} style={inpStyle} type="password" placeholder="Repeat password"
                  value={v.confirmPassword} onChange={e => setV({ ...v, confirmPassword: e.target.value })} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold flex items-center justify-center"
                style={{ backgroundColor: '#ff5722', opacity: loading ? 0.7 : 1 }}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
