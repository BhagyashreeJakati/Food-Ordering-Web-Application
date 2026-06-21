import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ForgotPassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await api.post('/user/forgot-password', { email });
      setSent(true);
    } catch {
      setSent(true); // Always show success — don't reveal if email exists
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
        <button onClick={() => navigate('/account/login')}
          className="flex items-center gap-2 mb-6 text-sm"
          style={{ color: theme.palette.text.secondary }}>
          <ArrowBackIcon sx={{ fontSize: '1rem' }} /> Back to login
        </button>
        <div className="rounded-2xl p-8"
          style={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#fff0eb' }}>
              <span style={{ fontSize: 28 }}>🔐</span>
            </div>
            <h2 className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>Forgot password?</h2>
            <p className="text-sm mt-2" style={{ color: theme.palette.text.secondary }}>
              Enter your email and we'll send you a reset link
            </p>
          </div>
          {sent ? (
            <div className="text-center">
              <div style={{ fontSize: 48 }} className="mb-4">📧</div>
              <p className="font-semibold mb-2" style={{ color: theme.palette.text.primary }}>Check your email</p>
              <p className="text-sm mb-6" style={{ color: theme.palette.text.secondary }}>
                If <strong>{email}</strong> is registered, a reset link has been sent. Check your inbox and spam folder. Link expires in 15 minutes.
              </p>
              <button onClick={() => navigate('/account/login')}
                className="w-full py-3 rounded-xl text-white font-semibold"
                style={{ backgroundColor: '#ff5722' }}>
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold mb-1 block"
                  style={{ color: theme.palette.text.secondary }}>Email address</label>
                <input className={inp} style={inpStyle} type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold flex items-center justify-center"
                style={{ backgroundColor: '#ff5722', opacity: loading ? 0.7 : 1 }}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
