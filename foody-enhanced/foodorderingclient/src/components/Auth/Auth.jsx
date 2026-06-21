import { Box, Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function Auth() {
  const { token } = useSelector(s => s.auth);
  const localToken = localStorage.getItem('jwtToken');
  const isLoggedIn = !!(token || localToken);

  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const isAuth =
    pathname.toLowerCase().includes('/account/register') ||
    pathname.toLowerCase().includes('/account/login');

  useEffect(() => {
    if (isLoggedIn && isAuth) navigate('/', { replace: true });
  }, [isLoggedIn, isAuth, navigate]);

  if (isLoggedIn) return null;

  return (
    <Modal open={isAuth} onClose={() => navigate('/', { replace: true })}>
      <Box
        sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          bgcolor: 'background.paper', borderRadius: 3,
          boxShadow: 24, p: 0, outline: 'none',
          width: { xs: '95%', sm: 440 },
          maxHeight: '95vh', overflow: 'auto',
        }}
      >
        {pathname.toLowerCase().includes('/account/register')
          ? <RegisterForm />
          : <LoginForm />}
      </Box>
    </Modal>
  );
}
