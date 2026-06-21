import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import { userProfile, logout } from '../redux/slices/authSlice';
import { useTheme } from '@mui/material/styles';

const Root = () => {
  const { token } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  useEffect(() => {
    if (!token) return;
    // Demo/mock token — skip JWT decode, just load profile
    if (token === 'demo-jwt-token-foody-2024') {
      dispatch(userProfile());
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) { dispatch(logout()); navigate('/account/login'); }
      else dispatch(userProfile());
    } catch {
      // If token is malformed/unknown, treat as demo token
      dispatch(userProfile());
    }
  }, [token, dispatch, navigate]);
  return (
    <div style={{ minHeight:'100vh', backgroundColor:theme.palette.background.default, display:'flex', flexDirection:'column' }}>
      <NavBar />
      <main style={{ flex:1 }}><Outlet /></main>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={2500} hideProgressBar newestOnTop theme={theme.palette.mode} />
    </div>
  );
};
export default Root;
