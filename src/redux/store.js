// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice"; // Import the cartReducer from cartSlice.js
import productSlice from './rentProductSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer, // Use cartReducer here
    product: productSlice,
  },
});

export default store;
