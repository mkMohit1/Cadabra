import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("loggedInUser")) || null, // Full user details
  loading: false,
  error: null,

};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      console.log("Payload:", action.payload);
      state.user = { ...action.payload }; // Store full user details
      localStorage.setItem("loggedInUser", JSON.stringify(state.user)); // Persist user in localStorage
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("loggedInUser");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
