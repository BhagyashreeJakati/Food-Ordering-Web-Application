import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
export default function Footer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const sections = [
    { title:'Company', links:['About Us','Careers','Blog','Contact Us'] },
    { title:'For Restaurants', links:['Partner With Us','Admin Login','Manage Menu','Restaurant Support'] },
    { title:'Legal', links:['Privacy Policy','Terms of Service','Cookie Policy','Refund Policy'] },
  ];
  return (
    <footer style={{ backgroundColor:'#111827', color:'#d1d5db', marginTop:'auto' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 24px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, marginBottom:36 }}>
          <div>
            <div style={{ fontSize:'1.5rem', fontWeight:900, color:'#ff5722', marginBottom:12, cursor:'pointer' }} onClick={() => navigate('/')}>🍕 Foody</div>
            <p style={{ fontSize:'.84rem', lineHeight:1.75, color:'#9ca3af', maxWidth:230 }}>India's favourite food delivery app. Order from top restaurants and get hot food at your doorstep in 30 minutes.</p>
          </div>
          {sections.map(s => (
            <div key={s.title}>
              <p style={{ color:'#fff', fontSize:'.88rem', fontWeight:700, marginBottom:14 }}>{s.title}</p>
              {s.links.map(l => <div key={l} style={{ fontSize:'.83rem', color:'#9ca3af', marginBottom:10, cursor:'pointer' }} onMouseEnter={e=>e.target.style.color='#ff5722'} onMouseLeave={e=>e.target.style.color='#9ca3af'}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid #1f2937', paddingTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:'.8rem', color:'#6b7280' }}>© {new Date().getFullYear()} Foody Technologies Pvt. Ltd. All rights reserved.</p>
          <div style={{ display:'flex', gap:8 }}>
            <span style={{ fontSize:'.72rem', fontWeight:700, padding:'5px 12px', borderRadius:999, background:'#dcfce7', color:'#15803d' }}>🔒 SSL Secured</span>
            <span style={{ fontSize:'.72rem', fontWeight:700, padding:'5px 12px', borderRadius:999, background:'#dbeafe', color:'#1e40af' }}>💳 Razorpay Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
