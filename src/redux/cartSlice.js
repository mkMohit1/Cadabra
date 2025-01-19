import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { act } from "react";

// Helper functions for localStorage
const saveCartToLocalStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const loadCartFromLocalStorage = () => {
  const cart = localStorage.getItem('cart');
  console.log('cart', cart);
  return cart ? JSON.parse(cart) : [];
};

const initialState = {
  totalCartCount: 0,
  cartItem: loadCartFromLocalStorage(),
  sellCartItem: [],
  cartMode: 'rent',
  currentContainer: 'CartItem',
};

// Async thunk to validate cart items
export const validateCart = createAsyncThunk(
  'cart/validateCart',
  async (cartItems) => {
    const response = await fetch('http://localhost:5000/product/validate-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems }),
    });
    return await response.json();
  }
);

// Async thunk to sync cart with server
export const syncCartWithServer = createAsyncThunk(
  'cart/syncCartWithServer',
  async ({ userId, cartItems }) => {
    // console.log(cartItems);
    try {
      const response = await fetch('http://localhost:5000/user/sync-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, cartItems }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync cart with server');
      }

      const data = await response.json();
      return data.cart; // Return updated cart from the server
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCartCount: (state, action) => {
      state.totalCartCount = action.payload;
    },
    updateCartMode: (state, action) => {
      state.cartMode = action.payload;
    },
    updateCartItem: (state, action) => {
      const updatedItem = { ...action.payload, addedAt: new Date().toISOString() };
      const existingItemIndex = state.cartItem.findIndex(item => item._id === updatedItem._id);
  
      if (existingItemIndex !== -1) {
          state.cartItem[existingItemIndex] = updatedItem;
      } else {
          state.cartItem.push(updatedItem);
      }
  
      state.totalCartCount = state.cartItem.length;
      saveCartToLocalStorage(state.cartItem);
  },  
    updateCurrentContainer: (state, action) => {
      state.currentContainer = action.payload; // Corrected spelling
    },
    updateSellCartCount: (state, action) => {
      const updatedItem = action.payload;
      const existingItemIndex = state.sellCartItem.findIndex(item => item._id === updatedItem._id);

      if (existingItemIndex !== -1) {
        state.sellCartItem[existingItemIndex] = updatedItem;
      } else {
        state.sellCartItem.push(updatedItem);
      }
    },
    removeCartItem: (state, action) => {
      const currentID = action.payload._id;
      state.cartItem = state.cartItem.filter(item => item._id !== currentID);
      state.totalCartCount = state.cartItem.length;
      saveCartToLocalStorage(state.cartItem);
    },
    removeOldCartItems: (state) => {
      const now = Date.now();
      const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
      const expiredItems = state.cartItem.filter(
        (item) => now - new Date(item.addedAt).getTime() > THIRTY_DAYS
      );

      if (expiredItems.length > 0) {
        console.log(`${expiredItems.length} items removed due to expiry`);
      }

      state.cartItem = state.cartItem.filter(
        (item) => now - new Date(item.addedAt).getTime() <= THIRTY_DAYS
      );
      state.totalCartCount = state.cartItem.length;
      saveCartToLocalStorage(state.cartItem);
    },
    removeSellCartItem: (state, action) => {
      const currentID = action.payload.id;
      state.sellCartItem = state.sellCartItem.filter(item => item.id !== currentID);
    },


  },
  extraReducers: (builder) => {
    builder.addCase(validateCart.fulfilled, (state, action) => {
      if(action.payload.error){
        state.cartItem = [];
        state.totalCartCount =0;
        saveCartToLocalStorage([]);
      }
      state.cartItem = action.payload.validatedItems;
      state.totalCartCount = action.payload.validatedItems.length;
      console.log(action.payload);
      saveCartToLocalStorage(state.cartItem);
    });
    builder.addCase(syncCartWithServer.fulfilled, (state, action) => {
      console.log(action.payload);
      state.cartItem = action.payload; // Clear Redux cartItem
      state.totalCartCount = action.payload.length;
      saveCartToLocalStorage(state.cartItem); // Clear localStorage
    });
  }
});

export const {
  updateCartCount,
  updateCartMode,
  updateCartItem,
  updateCurrentContainer,
  updateSellCartCount,
  removeCartItem,
  removeOldCartItems,
  removeSellCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;
