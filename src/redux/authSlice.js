import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("loggedInUser")) || null, // Initialize from localStorage
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      localStorage.setItem("loggedInUser", JSON.stringify(action.payload)); // Persist in localStorage
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("loggedInUser"); // Remove from localStorage
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
