import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const saveCartToLocalStorage = (cart) => {
  // console.log("cart",cart);
  localStorage.setItem('cart', JSON.stringify(cart));
};
const saveNCartToLocalStorage = (cart) => {
  // console.log("cart",cart);
  localStorage.setItem('cartNuser', JSON.stringify(cart));
};

const loadCartFromLocalStorage = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

const loadNCartFromLocalStorage = () => {
  const cart = localStorage.getItem('cartNuser');
  return cart ? JSON.parse(cart) : [];
};

const initialState = {
  totalCartCount: 0,
  totalNCartCount: 0,
  cartItem: loadCartFromLocalStorage(),
  cartNItem: loadNCartFromLocalStorage(),
  sellCartItem: [],
  cartMode: 'rent',
  itemDelete: false,
  currentContainer: 'CartItem',
};

export const syncCartWithServer = createAsyncThunk(
  'cart/syncCartWithServer',
  async ({ userId, cartItems,delta }, { getState }) => {
    const { itemDelete } = getState().cart;
    // console.log(userId, cartItems,delta);
    if (!itemDelete) {
      try {
        const response = await fetch(`${process.env.Back_Url}/user/sync-cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, cartItems,delta }),
        });
        if (!response.ok) throw new Error('Failed to sync cart with server');
        const data = await response.json();
        return data.cart;
      } catch (error) {
        console.error('Error syncing cart:', error);
        throw error;
      }
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCartItem: (state, action) => {
      const updatedItem = action.payload;
      if(updatedItem.mohit){
        const existingItemIndex = state.cartNItem.length>0 ?state.cartNItem.findIndex(item => item.productId._id === updatedItem.productId._id): -1;
        if (existingItemIndex == -1) {
          state.cartNItem.push({ ...updatedItem });
        }
        state.totalNCartCount = state.cartNItem.length;
        saveNCartToLocalStorage(state.cartNItem);
      }
      if(updatedItem.user){
        state.cartItem = action.payload.cart;
      }
    },
    // updateCartItemsONRefresh: (state, action) => {
    //   state.cartItem = action.payload;
    //   state.totalCartCount = action.payload.length;
    //   saveCartToLocalStorage(state.cartItem);
    // },
    updateQuantity: (state, action) => {
      const { id, quantity, user } = action.payload;
      if(user){
        const existingItemIndex = state.cartItem.findIndex(item => item._id === id);
        if(existingItemIndex !==-1){
          if(existingItemIndex.quantity === 1 && quantity === -1){
            // do nothing
          }
          state.cartItem[existingItemIndex].quantity += quantity;
          saveCartToLocalStorage(state.cartItem);
        }
      }else{
        const existingNItemIndex = state.cartNItem.findIndex(item => item.productId._id === id);
        if(existingNItemIndex !==-1){
          if(existingNItemIndex.quantity === 1 && quantity === -1){
            // do nothing
          }
          state.cartNItem[existingNItemIndex].quantity += quantity;
          saveNCartToLocalStorage(state.cartNItem);
        }
        
      }
    },
    removeCartItem: (state, action) => {
      let currentID;
      if(action.payload.user){  
        currentID = action.payload._id;
        state.cartItem = state.cartItem.filter(item => {
          // console.log(item.productId._id == currentID);
          return item.productId._id != currentID;
        });
        state.totalCartCount = state.cartItem.length;
        saveCartToLocalStorage(state.cartItem);
      }else{
        currentID = action.payload.product._id;
        state.cartNItem = state.cartNItem.filter(item => item.productId._id !== currentID);
        state.totalNCartCount = state.cartNItem.length;
        saveNCartToLocalStorage(state.cartNItem);
      }
    },
    removeSellCartItem: (state, action) => {
      const currentID = action.payload.id;
      state.sellCartItem = state.sellCartItem.filter(item => item.id !== currentID);
    },
    updateCurrentContainer: (state, action) => {
      state.currentContainer = action.payload;
    },
    updateCartMode:(state,action)=>{
      state.cartMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(syncCartWithServer.fulfilled, (state, action) => {
      if (!state.itemDelete) {
        state.cartItem = action.payload;
        state.totalCartCount = action.payload.length;
      } else {
        state.itemDelete = false;
      }
      saveCartToLocalStorage(state.cartItem);
    });
  }
});

export const {
  updateCartItem,
  removeCartItem,
  removeSellCartItem,
  updateCurrentContainer,
  updateCartMode,
  updateQuantity,
  // updateCartItemsONRefresh
} = cartSlice.actions;

export default cartSlice.reducer;
