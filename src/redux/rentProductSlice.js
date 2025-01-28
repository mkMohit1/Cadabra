import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Initial state
const initialState = {
  rentProduct: [],
  indiaStatesAndUTs: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Jammu and Kashmir", 
    "Ladakh", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
    "Lakshadweep", "Delhi", "Puducherry"
  ],
  tenureOptions :[
    "Less than a Quarter",
    "Quarter (4 months)",
    "Half Year (6 months)",
    "One Year",
    "More than One Year"
  ],
  typeofServiceProvide: [
    "type A",
    "type B",
    "type C",
  ],
  categories: [
    "Electronics",
    "CCTV",
    "Security Systems",
  ],
  serviceProvideIn: ['Delhi'],
  loading: false,
  error: null
};

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk("product/fetchProduct", async () => {
  try {
    const response = await fetch(`${process.env.Back_Url}/products/allproducts`, {
      method: 'GET',
      credentials: 'include', // Include cookies for authentication
    });
    if (!response.ok) {
      throw new Error("Error fetching products");
    }
    const data = await response.json(); // Parse the JSON response
    return data.products; // Return the products from the response
  } catch (error) {
    toast.error("Error while fetching the product");
    throw error; // Rethrow the error so it can be caught in the extraReducers
  }
});

// Product slice
const productSlice = createSlice({
  name: 'rentProduct',
  initialState,
  reducers: {
    currentRentProduct: (state, action) => {
      state.rentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true; // Set loading to true when the request is pending
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when the request is successful
        state.rentProduct = action.payload; // Set the fetched products to state
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false; // Set loading to false when the request fails
        state.error = action.error.message; // Set the error message in state
      });
  },
});

export const { currentRentProduct } = productSlice.actions;

export default productSlice.reducer;
