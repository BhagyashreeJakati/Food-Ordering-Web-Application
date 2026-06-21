import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function NotFound() {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: theme.palette.background.default, minHeight:'80vh' }} className="flex flex-col items-center justify-center px-4 text-center">
      <div className="text-9xl font-extrabold mb-4" style={{ color:'#ff5722', opacity:.12 }}>404</div>
      <div className="text-6xl mb-6">🍽️</div>
      <h1 className="text-3xl font-bold mb-3" style={{ color: theme.palette.text.primary }}>Page Not Found</h1>
      <p className="text-lg mb-8 max-w-md" style={{ color: theme.palette.text.secondary }}>Looks like this page went out for delivery and never came back!</p>
      <div className="flex gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold border" style={{ borderColor: theme.palette.divider, color: theme.palette.text.primary }}><ArrowBackIcon sx={{ fontSize:'1rem' }} /> Go Back</button>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white" style={{ backgroundColor:'#ff5722' }}><HomeOutlinedIcon sx={{ fontSize:'1rem' }} /> Home</button>
      </div>
    </div>
  );
}
