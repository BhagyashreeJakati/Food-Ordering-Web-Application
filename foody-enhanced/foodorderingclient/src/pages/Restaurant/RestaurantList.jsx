import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchResturants } from '../../redux/slices/restaurantSlice';
import RestaurantCard from './RestaurantCard';
import { CircularProgress, useTheme } from '@mui/material';

export default function RestaurantList() {
  const { restaurants, loading } = useSelector(s => s.restaurants);
  const dispatch = useDispatch();
  const theme = useTheme();
  useEffect(() => { dispatch(fetchResturants()); }, [dispatch]);
  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({length:8}).map((_,i) => (
        <div key={i} className="rounded-2xl overflow-hidden" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
          <div className="h-44 animate-pulse" style={{ backgroundColor: theme.palette.divider }} />
          <div className="p-3 space-y-2"><div className="h-4 rounded animate-pulse w-3/4" style={{ backgroundColor: theme.palette.divider }} /><div className="h-3 rounded animate-pulse w-1/2" style={{ backgroundColor: theme.palette.divider }} /></div>
        </div>
      ))}
    </div>
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {(restaurants||[]).map(r => <RestaurantCard key={r.id} restaurant={r} />)}
    </div>
  );
}
