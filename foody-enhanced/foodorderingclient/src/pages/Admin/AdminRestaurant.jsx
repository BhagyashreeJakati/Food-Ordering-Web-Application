/* import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';

const AdminRestaurant = () => {
  const [restaurant, setRestaurant] = useOutletContext();
  const [changing, setChanging] = useState(false);

  const toggleStatus = async () => {
    setChanging(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await axios.put(`http://localhost:8080/api/v1/admin/restaurants/${restaurant.id}/status`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setRestaurant(res.data.payload);
      toast.success(`Restaurant is now ${res.data.payload.open ? 'Open ✅' : 'Closed ❌'}`);
    } catch {
      // Demo mode: toggle locally
      const updated = { ...restaurant, open: !restaurant.open };
      setRestaurant(updated);
      toast.success(`Restaurant is now ${updated.open ? 'Open ✅' : 'Closed ❌'} (demo)`);
    } finally { setChanging(false); }
  };

  if (!restaurant) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-3xl">
      {restaurant.images?.[0] && (
        <img src={restaurant.images[0]} alt={restaurant.name} className="w-full h-52 object-cover" />
      )}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{restaurant.name}</h2>
            <p className="text-gray-500 mt-1 max-w-lg text-sm">{restaurant.description}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${restaurant.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {restaurant.open ? 'OPEN' : 'CLOSED'}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
          {restaurant.address && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-gray-50">
              <PlaceIcon sx={{ fontSize:'1rem', mt:0.3, color:'#ff5722' }} />
              <span>{restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state} – {restaurant.address.pinCode}</span>
            </div>
          )}
          {restaurant.openingHours && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
              <AccessTimeIcon sx={{ fontSize:'1rem', color:'#ff5722' }} />
              <span>{restaurant.openingHours}</span>
            </div>
          )}
          {restaurant.contactInformation?.mobile && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
              <PhoneIcon sx={{ fontSize:'1rem', color:'#ff5722' }} />
              <span>{restaurant.contactInformation.mobile}</span>
            </div>
          )}
          {restaurant.cuisineType && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
              <span className="text-lg">🍽️</span>
              <span>{restaurant.cuisineType}</span>
            </div>
          )}
        </div>

        <button onClick={toggleStatus} disabled={changing}
          className="mt-6 px-6 py-3 rounded-xl font-bold text-white text-sm flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: restaurant.open ? '#ef4444' : '#22c55e' }}>
          {changing ? 'Updating…' : restaurant.open ? '🔴 Mark as Closed' : '🟢 Mark as Open'}
        </button>
      </div>
    </div>
  );
};

export default AdminRestaurant;*/


import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const EMPTY_FORM = {
  name: '', description: '', cuisineType: '', openingHours: '',
  street: '', city: '', state: '', pinCode: '', country: 'India',
  mobile: '', imageUrl: '',
};

const AdminRestaurant = () => {
  // Context now: [selectedRestaurant, onAdded, onUpdated]
  const [restaurant, onRestaurantAdded, onRestaurantUpdated] = useOutletContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [toggling, setToggling] = useState(false);

  const token = localStorage.getItem('jwtToken');
  const headers = { Authorization: `Bearer ${token}` };

  const handleField = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const openModal = () => { setForm(EMPTY_FORM); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleCreate = async () => {
    if (!form.name || !form.city) { toast.error('Restaurant name and city are required'); return; }
    setCreating(true);
    try {
      const res = await axios.post(
        'http://localhost:8080/api/v1/admin/restaurants',
        {
          name: form.name,
          description: form.description,
          cuisineType: form.cuisineType,
          openingHours: form.openingHours,
          images: form.imageUrl ? [form.imageUrl] : [],
          address: { street: form.street, city: form.city, state: form.state, pinCode: form.pinCode, country: form.country },
          contactInformation: { mobile: form.mobile },
          open: true,
        },
        { headers }
      );
      const created = res.data?.payload || res.data;
      onRestaurantAdded(created);
      toast.success(`"${created.name}" added! 🎉`);
      closeModal();
    } catch {
      // Demo fallback
      const created = {
        id: Date.now(),
        name: form.name, description: form.description,
        cuisineType: form.cuisineType, openingHours: form.openingHours,
        images: form.imageUrl ? [form.imageUrl] : [],
        address: { street: form.street, city: form.city, state: form.state, pinCode: form.pinCode },
        contactInformation: { mobile: form.mobile },
        open: true,
      };
      onRestaurantAdded(created);
      toast.success(`"${created.name}" added! (demo mode) 🎉`);
      closeModal();
    } finally {
      setCreating(false);
    }
  };

  const toggleStatus = async () => {
    if (!restaurant) return;
    setToggling(true);
    try {
      const res = await axios.put(
        `http://localhost:8080/api/v1/admin/restaurants/${restaurant.id}/status`,
        {}, { headers }
      );
      onRestaurantUpdated(res.data.payload);
      toast.success(`Now ${res.data.payload.open ? 'Open ✅' : 'Closed ❌'}`);
    } catch {
      const updated = { ...restaurant, open: !restaurant.open };
      onRestaurantUpdated(updated);
      toast.success(`Now ${updated.open ? 'Open ✅' : 'Closed ❌'} (demo)`);
    } finally { setToggling(false); }
  };

  return (
    <>
      {/* ── Page header with Add button always visible ─────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Restaurants</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your restaurants</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: '#ff5722' }}
        >
          <AddIcon fontSize="small" />
          Add Restaurant
        </button>
      </div>

      {/* ── Selected restaurant card ────────────────────────────────────── */}
      {restaurant ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-3xl">
          {restaurant.images?.[0] && (
            <img src={restaurant.images[0]} alt={restaurant.name} className="w-full h-52 object-cover" />
          )}
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{restaurant.name}</h2>
                <p className="text-gray-500 mt-1 max-w-lg text-sm">{restaurant.description}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${restaurant.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {restaurant.open ? 'OPEN' : 'CLOSED'}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              {restaurant.address && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-gray-50">
                  <PlaceIcon sx={{ fontSize: '1rem', mt: 0.3, color: '#ff5722' }} />
                  <span>{[restaurant.address.street, restaurant.address.city, restaurant.address.state, restaurant.address.pinCode].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {restaurant.openingHours && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
                  <AccessTimeIcon sx={{ fontSize: '1rem', color: '#ff5722' }} />
                  <span>{restaurant.openingHours}</span>
                </div>
              )}
              {restaurant.contactInformation?.mobile && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
                  <PhoneIcon sx={{ fontSize: '1rem', color: '#ff5722' }} />
                  <span>{restaurant.contactInformation.mobile}</span>
                </div>
              )}
              {restaurant.cuisineType && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
                  <span className="text-lg">🍽️</span>
                  <span>{restaurant.cuisineType}</span>
                </div>
              )}
            </div>

            <button
              onClick={toggleStatus} disabled={toggling}
              className="mt-6 px-6 py-3 rounded-xl font-bold text-white text-sm flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: restaurant.open ? '#ef4444' : '#22c55e' }}
            >
              {toggling ? 'Updating…' : restaurant.open ? '🔴 Mark as Closed' : '🟢 Mark as Open'}
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl bg-white rounded-2xl shadow-sm p-12 text-center">
          <StorefrontEmptyIcon />
          <p className="mt-4 text-gray-500 text-sm">No restaurant added yet. Click <strong>Add Restaurant</strong> to get started.</p>
        </div>
      )}

      {/* ── Add Restaurant Modal ────────────────────────────────────────── */}
      <Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '1rem' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <span className="font-bold text-gray-800">Add New Restaurant</span>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <CloseIcon fontSize="small" />
          </button>
        </DialogTitle>

        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
          <Section label="Basic Info">
            <Field label="Restaurant Name *" name="name" value={form.name} onChange={handleField} />
            <Field label="Description" name="description" value={form.description} onChange={handleField} multiline rows={2} />
            <TwoCol>
              <Field label="Cuisine Type" name="cuisineType" value={form.cuisineType} onChange={handleField} placeholder="e.g. Indian, Italian" />
              <Field label="Opening Hours" name="openingHours" value={form.openingHours} onChange={handleField} placeholder="9am – 10pm" />
            </TwoCol>
            <Field label="Cover Image URL" name="imageUrl" value={form.imageUrl} onChange={handleField} placeholder="https://..." />
          </Section>

          <Section label="Address">
            <Field label="Street" name="street" value={form.street} onChange={handleField} />
            <TwoCol>
              <Field label="City *" name="city" value={form.city} onChange={handleField} />
              <Field label="State" name="state" value={form.state} onChange={handleField} />
            </TwoCol>
            <TwoCol>
              <Field label="PIN Code" name="pinCode" value={form.pinCode} onChange={handleField} />
              <Field label="Country" name="country" value={form.country} onChange={handleField} />
            </TwoCol>
          </Section>

          <Section label="Contact">
            <Field label="Mobile Number" name="mobile" value={form.mobile} onChange={handleField} placeholder="+91 XXXXX XXXXX" />
          </Section>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <button onClick={closeModal}
            className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button onClick={handleCreate} disabled={creating}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: '#ff5722' }}>
            {creating ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <AddIcon sx={{ fontSize: '1rem' }} />}
            {creating ? 'Creating…' : 'Create Restaurant'}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// ── Small helpers ──────────────────────────────────────────────────────────
const Section = ({ label, children }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

const TwoCol = ({ children }) => (
  <div className="grid grid-cols-2 gap-3">{children}</div>
);

const Field = ({ label, name, value, onChange, multiline, rows, placeholder }) => (
  <TextField
    label={label} name={name} value={value} onChange={onChange}
    fullWidth size="small" multiline={multiline} rows={rows} placeholder={placeholder}
    sx={{
      '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#ff5722' },
      '& label.Mui-focused': { color: '#ff5722' },
    }}
  />
);

const StorefrontEmptyIcon = () => (
  <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 flex items-center justify-center">
    <span className="text-3xl">🏪</span>
  </div>
);

export default AdminRestaurant;

