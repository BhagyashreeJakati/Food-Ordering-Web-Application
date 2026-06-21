import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import { getMockMenuForRestaurant } from '../../utils/mockData';

const AdminFood = () => {
  const [restaurant] = useOutletContext();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', vegetarian: true, imageUrl: '', categoryName: 'Main Course' });
  const token = localStorage.getItem('jwtToken');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { if (restaurant) fetchFoods(); }, [restaurant]);

  const fetchFoods = () => {
    setLoading(true);
    axios.get(`http://localhost:8080/api/v1/foods/restaurant/${restaurant.id}?vegetarian=false&seasonal=false&nonveg=false`, { headers })
      .then(r => setFoods(r.data.payload || []))
      .catch(() => setFoods(getMockMenuForRestaurant(restaurant.id))) // Demo fallback
      .finally(() => setLoading(false));
  };

  const handleAdd = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    setSaving(true);
    try {
      const res = await axios.post('http://localhost:8080/api/v1/admin/foods', {
        name: form.name, description: form.description, price: parseFloat(form.price),
        images: form.imageUrl ? [form.imageUrl] : [], available: true, vegetarian: form.vegetarian,
        seasonal: false, restaurantId: restaurant.id, category: { name: form.categoryName }, ingredients: [],
      }, { headers });
      if (res.data?.payload) { setFoods(f => [...f, res.data.payload]); toast.success('Item added!'); }
    } catch {
      // Demo mode: add locally
      const newItem = {
        id: Date.now(), name: form.name, description: form.description,
        price: parseFloat(form.price), vegetarian: form.vegetarian, available: true,
        images: form.imageUrl ? [form.imageUrl] : ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'],
        seasonal: false, ingredients: [],
      };
      setFoods(f => [...f, newItem]);
      toast.success('Item added! (demo mode)');
    } finally {
      setSaving(false);
      setOpen(false);
      setForm({ name: '', description: '', price: '', vegetarian: true, imageUrl: '', categoryName: 'Main Course' });
    }
  };

  const toggle = (id) => {
    axios.put(`http://localhost:8080/api/v1/admin/foods/${id}`, {}, { headers })
      .then(r => setFoods(f => f.map(x => x.id === id ? r.data.payload : x)))
      .catch(() => {
        setFoods(f => f.map(x => x.id === id ? { ...x, available: !x.available } : x));
        toast.info('Availability updated (demo)');
      });
  };

  const del = (id) => {
    if (!window.confirm('Delete this item?')) return;
    axios.delete(`http://localhost:8080/api/v1/admin/foods/${id}`, { headers })
      .then(() => { setFoods(f => f.filter(x => x.id !== id)); toast.success('Deleted'); })
      .catch(() => { setFoods(f => f.filter(x => x.id !== id)); toast.success('Deleted (demo)'); });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold">Menu Management</h2>
          <p className="text-gray-500 text-sm">{foods.length} items on the menu</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90" style={{ backgroundColor:'#ff5722' }}>
          <AddIcon fontSize="small" /> Add Item
        </button>
      </div>

      {loading ? <div className="flex justify-center py-10"><CircularProgress sx={{ color:'#ff5722' }} /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {foods.map(food => (
            <div key={food.id} className="border rounded-2xl overflow-hidden flex flex-col">
              <img src={food.images?.[0]||'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'} alt={food.name} className="w-full h-36 object-cover" />
              <div className="p-3 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{food.name}</p>
                    {food.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{food.description}</p>}
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${food.vegetarian?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{food.vegetarian?'VEG':'NON-VEG'}</span>
                </div>
                <p className="font-bold text-orange-500 mt-2">₹{food.price}</p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                  <FormControlLabel control={<Switch checked={food.available} onChange={() => toggle(food.id)} size="small" color="warning" />} label={<span className="text-xs font-medium">{food.available?'Available':'Unavailable'}</span>} />
                  <button onClick={() => del(food.id)} className="text-xs text-red-500 font-semibold hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Food Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx:{ borderRadius:'1rem' } }}>
        <DialogTitle sx={{ fontWeight:700 }}>Add Menu Item</DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <Grid container spacing={2} sx={{ mt:0 }}>
            <Grid item xs={12}><TextField fullWidth label="Item Name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} size="small" /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} size="small" multiline rows={2} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Price (₹) *" type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} size="small" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Category" value={form.categoryName} onChange={e=>setForm(f=>({...f,categoryName:e.target.value}))} size="small" /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Image URL (optional)" value={form.imageUrl} onChange={e=>setForm(f=>({...f,imageUrl:e.target.value}))} size="small" /></Grid>
            <Grid item xs={12}><FormControlLabel control={<Switch checked={form.vegetarian} onChange={e=>setForm(f=>({...f,vegetarian:e.target.checked}))} color="success" />} label="Vegetarian" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:2 }}>
          <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
          <button onClick={handleAdd} disabled={saving} className="px-5 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2" style={{ backgroundColor:'#ff5722', opacity:saving?0.7:1 }}>
            {saving?<><CircularProgress size={14} color="inherit" /> Saving…</>:'Add Item'}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AdminFood;
