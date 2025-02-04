// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice"; // Import the cartReducer from cartSlice.js
import productSlice from './rentProductSlice';
import authReducer from './authSlice';
import blogReducer from "./blogSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer, // Use cartReducer here
    product: productSlice,
    blogs: blogReducer,
  },
});

export default store;
