import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import StatusCode from '../../utils/StatusCode';

const initialState = { cart: [], status: StatusCode.IDLE, loading: false };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.cart.find(i => i.id === item.id);
      if (existing) existing.quantity = Math.min(10, existing.quantity + 1);
      else state.cart.push({ ...item, quantity: 1 });
    },
    decrementCart: (state, action) => {
      const id = action.payload;
      const idx = state.cart.findIndex(i => i.id === id);
      if (idx > -1) {
        state.cart[idx].quantity--;
        if (state.cart[idx].quantity <= 0) state.cart.splice(idx, 1);
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(i => i.id !== action.payload);
    },
    clearLocalCart: (state) => { state.cart = []; },
  },
});
export const { addToCart, decrementCart, removeFromCart, clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
