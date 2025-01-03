import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalCartCount: 0, // Holds the count of items in the cart
  cartItem: [],      // Items in the cart for renting
  sellCartItem: [],  // Items in the cart for selling
  cartMode: 'rent',   // Default cart mode is 'rent' ['CartItem','AddressContainer','Shipping']
  currentContainer:'CartItem'
};

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
      const updatedItem = action.payload;
      const existingItemIndex = state.cartItem.findIndex(item => item._id === updatedItem._id);

      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        state.cartItem[existingItemIndex] = updatedItem;
      } else {
        // Otherwise, add new item
        state.cartItem.push(updatedItem);
      }
      state.totalCartCount += 1;
    },
    updateCurrentContainer: (state, action) => {
      state.currentContainer = action.payload; // Corrected spelling
    },
    updateSellCartCount: (state, action) => {
      const updatedItem = action.payload;
      const existingItemIndex = state.sellCartItem.findIndex(item => item._id === updatedItem._id);

      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        state.sellCartItem[existingItemIndex] = updatedItem;
      } else {
        // Otherwise, add new item
        state.sellCartItem.push(updatedItem);
      }
    },
    removeCartItem: (state, action) => {
      const currentID = action.payload._id;
      state.cartItem = state.cartItem.filter(item => item._id !== currentID);
      state.totalCartCount -= 1;
    },
    removeSellCartItem: (state, action) => {
      const currentID = action.payload.id;
      state.sellCartItem = state.sellCartItem.filter(item => item.id !== currentID);
    }
  }
});

export const {
  updateCartCount,
  updateCartMode,
  updateCartItem,
  updateSellCartCount,
  removeCartItem,
  removeSellCartItem,
  updateCurrentContainer
} = cartSlice.actions;

export default cartSlice.reducer;
