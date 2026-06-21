import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, resetState } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import StatusCode from '../../utils/StatusCode';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';

// Check if a user is a restaurant owner regardless of how role is stored
const isOwner = (user) => {
  if (!user) return false;
  const role = user.role;
  if (!role) return false;
  if (typeof role === 'string') return role === 'ROLE_RESTAURANT_OWNER';
  if (typeof role === 'object') return role.name === 'ROLE_RESTAURANT_OWNER' || role.value === 'Restaurant Owner';
  return false;
};

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { loginStatus, error, user } = useSelector(s => s.auth);
  const [v, setV] = useState({ email: '', password: '' });
  const [e, setE] = useState({});

  const schema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  useEffect(() => {
    if (loginStatus === StatusCode.FAILED && error) {
      toast.error(error?.message || 'Login failed');
      dispatch(resetState());
    }
    if (loginStatus === StatusCode.SUCCESS && user) {
      toast.success('Welcome back! 👋');
      dispatch(resetState());
      // Role-based redirect
      if (isOwner(user)) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [loginStatus, error, user]);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    schema
      .validate(v, { abortEarly: false })
      .then(() => dispatch(loginUser(v)))
      .catch(err => {
        const ve = {};
        err.inner.forEach(x => { ve[x.path] = x.message; });
        setE(ve);
      });
  };

  const inp = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all';
  const inpStyle = {
    backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f8f8f8',
    border: `1.5px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: '#ff5722' }}>
          <span className="text-white font-bold text-xl">F</span>
        </div>
        <h2 className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>Welcome back</h2>
        <p className="text-sm mt-1" style={{ color: theme.palette.text.secondary }}>Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input className={inp} style={inpStyle} type="email" placeholder="Email address"
            value={v.email} onChange={x => setV({ ...v, email: x.target.value })} />
          {e.email && <p className="text-xs text-red-500 mt-1">{e.email}</p>}
        </div>
        <div>
          <input className={inp} style={inpStyle} type="password" placeholder="Password"
            value={v.password} onChange={x => setV({ ...v, password: x.target.value })} />
          {e.password && <p className="text-xs text-red-500 mt-1">{e.password}</p>}
        </div>
        <div className="text-right">
          <button type="button" onClick={() => navigate('/forgot-password')}
            className="text-xs" style={{ color: '#ff5722' }}>
            Forgot password?
          </button>
        </div>
        <button type="submit" disabled={loginStatus === StatusCode.LOADING}
          className="w-full py-3 rounded-xl text-white font-bold text-base flex items-center justify-center"
          style={{ backgroundColor: '#ff5722', opacity: loginStatus === StatusCode.LOADING ? 0.7 : 1 }}>
          {loginStatus === StatusCode.LOADING
            ? <CircularProgress size={20} color="inherit" />
            : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm mt-4" style={{ color: theme.palette.text.secondary }}>
        New to Foody?{' '}
        <button onClick={() => navigate('/account/register')} className="font-bold" style={{ color: '#ff5722' }}>
          Create account
        </button>
      </p>
    </div>
  );
}
