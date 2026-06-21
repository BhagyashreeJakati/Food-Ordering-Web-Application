import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import restaurantSlice from "./slices/restaurantSlice";
import cartReducer from "./slices/cartSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    restaurants: restaurantSlice,
    cart: cartReducer,
  },
});

export default store;
