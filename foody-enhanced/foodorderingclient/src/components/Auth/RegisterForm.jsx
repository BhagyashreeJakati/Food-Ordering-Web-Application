import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetState } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import StatusCode from '../../utils/StatusCode';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { loginStatus, error } = useSelector(s => s.auth);
  const [v, setV] = useState({ fullName: '', email: '', password: '', role: 'ROLE_CUSTOMER' });
  const [e, setE] = useState({});

  const schema = Yup.object({
    fullName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Required'),
  });

  useEffect(() => {
    if (loginStatus === StatusCode.FAILED && error) {
      toast.error(error?.message || 'Registration failed');
      dispatch(resetState());
    }
    if (loginStatus === StatusCode.SUCCESS) {
      toast.success('Account created! 🎉');
      dispatch(resetState());
      navigate('/', { replace: true });
    }
  }, [loginStatus, error]);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    schema
      .validate(v, { abortEarly: false })
      .then(() => dispatch(registerUser(v)))
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
        <h2 className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>Create your account</h2>
        <p className="text-sm mt-1" style={{ color: theme.palette.text.secondary }}>Join millions who order on Foody</p>
      </div>

      {/* Role selector */}
      <div className="flex gap-3 mb-5">
        {[
          { value: 'ROLE_CUSTOMER', label: '🛵 Customer', desc: 'Order food' },
          { value: 'ROLE_RESTAURANT_OWNER', label: '🍳 Restaurant Owner', desc: 'Manage restaurant' },
        ].map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setV({ ...v, role: opt.value })}
            className="flex-1 py-3 px-2 rounded-xl border-2 text-center transition-all"
            style={{
              borderColor: v.role === opt.value ? '#ff5722' : theme.palette.divider,
              backgroundColor: v.role === opt.value ? '#fff0eb' : theme.palette.background.paper,
              color: v.role === opt.value ? '#ff5722' : theme.palette.text.secondary,
            }}>
            <div className="font-semibold text-sm">{opt.label}</div>
            <div className="text-xs mt-0.5" style={{ color: v.role === opt.value ? '#ff5722' : theme.palette.text.secondary }}>
              {opt.desc}
            </div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input className={inp} style={inpStyle} placeholder="Full Name"
            value={v.fullName} onChange={x => setV({ ...v, fullName: x.target.value })} />
          {e.fullName && <p className="text-xs text-red-500 mt-1">{e.fullName}</p>}
        </div>
        <div>
          <input className={inp} style={inpStyle} type="email" placeholder="Email address"
            value={v.email} onChange={x => setV({ ...v, email: x.target.value })} />
          {e.email && <p className="text-xs text-red-500 mt-1">{e.email}</p>}
        </div>
        <div>
          <input className={inp} style={inpStyle} type="password" placeholder="Password (min 6 chars)"
            value={v.password} onChange={x => setV({ ...v, password: x.target.value })} />
          {e.password && <p className="text-xs text-red-500 mt-1">{e.password}</p>}
        </div>
        <button type="submit" disabled={loginStatus === StatusCode.LOADING}
          className="w-full py-3 rounded-xl text-white font-bold text-base flex items-center justify-center"
          style={{ backgroundColor: '#ff5722', opacity: loginStatus === StatusCode.LOADING ? 0.7 : 1 }}>
          {loginStatus === StatusCode.LOADING
            ? <CircularProgress size={20} color="inherit" />
            : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: theme.palette.text.secondary }}>
        Already have an account?{' '}
        <button onClick={() => navigate('/account/login')} className="font-bold" style={{ color: '#ff5722' }}>
          Sign in
        </button>
      </p>
    </div>
  );
}
