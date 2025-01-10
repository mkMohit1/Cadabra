import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("loggedInUser")) || null, // Initialize from localStorage
  userDetail: null,
  loading: false, // Loading state for async actions
  error: null, // To track errors from async actions
};

// Async thunk to fetch user details (example with a mock API call)
const updateUserDetail = createAsyncThunk(
  "user/UserDetail", 
  async (userId, { rejectWithValue }) => {
    try {
      // Replace this with an actual API call, e.g., to get user details from a server
      const response = await fetch(`https://api.example.com/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      return data; // Return user details data
    } catch (error) {
      return rejectWithValue(error.message); // Return error message if request fails
    }
  }
);

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
  extraReducers: (builder) => {
    // Handle the pending, fulfilled, and rejected actions of updateUserDetail
    builder
      .addCase(updateUserDetail.pending, (state) => {
        state.loading = true; // Start loading
        state.error = null; // Clear previous errors
      })
      .addCase(updateUserDetail.fulfilled, (state, action) => {
        state.loading = false; // Stop loading
        state.userDetail = action.payload; // Store user details
      })
      .addCase(updateUserDetail.rejected, (state, action) => {
        state.loading = false; // Stop loading
        state.error = action.payload; // Set error message
      });
  },
});

export const { login, logout } = authSlice.actions;

export { updateUserDetail }; // Export the async thunk action
export default authSlice.reducer;
