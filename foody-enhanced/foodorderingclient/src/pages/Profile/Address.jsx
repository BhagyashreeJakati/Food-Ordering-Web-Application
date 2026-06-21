import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Grid, TextField } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function Address() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const schema = Yup.object({ streetAddress:Yup.string().required('Required'), city:Yup.string().required('Required'), state:Yup.string().required('Required'), pincode:Yup.string().matches(/^\d{6}$/,'6-digit pincode').required('Required') });
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>Saved Addresses</h1>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ backgroundColor:'#ff5722' }}><AddLocationAltIcon sx={{ fontSize:'1rem' }} /> Add New</button>
      </div>
      {addresses.length===0 ? (
        <div className="text-center py-20"><div className="text-6xl mb-4">🏠</div><p className="text-xl font-semibold" style={{ color: theme.palette.text.primary }}>No saved addresses</p><p className="mt-2" style={{ color: theme.palette.text.secondary }}>Add an address to speed up checkout</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {addresses.map((addr,i) => (
            <div key={i} className="rounded-2xl p-5 flex gap-4" style={{ backgroundColor: theme.palette.background.paper, border:`1px solid ${theme.palette.divider}` }}>
              <HomeOutlinedIcon sx={{ color:'#ff5722', flexShrink:0, mt:0.5 }} />
              <div className="flex-1"><p className="font-semibold text-sm">Address {i+1}</p><p className="text-xs mt-1" style={{ color: theme.palette.text.secondary }}>{addr.streetAddress}, {addr.city}, {addr.state} – {addr.pincode}</p></div>
              <button onClick={() => setAddresses(a => a.filter((_,idx)=>idx!==i))}><DeleteOutlineIcon sx={{ fontSize:'1.1rem', color: theme.palette.text.secondary }} /></button>
            </div>
          ))}
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', bgcolor:'background.paper', borderRadius:3, boxShadow:24, p:4, outline:'none', width:{xs:'90%',sm:460} }}>
          <h2 className="text-xl font-bold mb-5">Add New Address</h2>
          <Formik initialValues={{ streetAddress:'', city:'', state:'', pincode:'' }} validationSchema={schema} onSubmit={(v,{resetForm})=>{setAddresses(a=>[...a,v]);resetForm();setOpen(false);}}>
            {({errors,touched})=>(
              <Form><Grid container spacing={2}>
                <Grid item xs={12}><Field as={TextField} name="streetAddress" label="Street Address" fullWidth size="small" error={touched.streetAddress&&!!errors.streetAddress} helperText={touched.streetAddress&&errors.streetAddress} /></Grid>
                <Grid item xs={6}><Field as={TextField} name="city" label="City" fullWidth size="small" error={touched.city&&!!errors.city} helperText={touched.city&&errors.city} /></Grid>
                <Grid item xs={6}><Field as={TextField} name="state" label="State" fullWidth size="small" error={touched.state&&!!errors.state} helperText={touched.state&&errors.state} /></Grid>
                <Grid item xs={12}><Field as={TextField} name="pincode" label="Pincode" fullWidth size="small" error={touched.pincode&&!!errors.pincode} helperText={touched.pincode&&errors.pincode} /></Grid>
                <Grid item xs={12}><button type="submit" className="w-full py-3 rounded-xl text-white font-bold" style={{ backgroundColor:'#ff5722' }}>Save Address</button></Grid>
              </Grid></Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
}
