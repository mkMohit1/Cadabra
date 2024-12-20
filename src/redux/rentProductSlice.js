import { createSlice } from "@reduxjs/toolkit";
import serviceImg from "../ImagePath";

const initialState ={
    rentProduct:[
        { id: 1, rentquantity: 1, sellQuantity:1, name: "White Shirt", rentprice: "$24.45", sellprice: '$60.80', days: "5 days", image: serviceImg[0] },
        { id: 2, rentquantity: 1, sellQuantity:1, name: "Channel", rentprice: "$24.45", sellprice: '$60.80', days: "5 days", image: serviceImg[1] },
        { id: 3, rentquantity: 1, sellQuantity:1, name: "Running Sneaker", rentprice: "$24.45", sellprice: '$60.80', days: "5 days", image: serviceImg[2] },
        { id: 4, rentquantity: 1, sellQuantity:1, name: "Red Shirt", rentprice: "$24.45", sellprice: '$60.80', days: "5 days", image: serviceImg[0] },
        { id: 5, rentquantity: 1, sellQuantity:1, name: "Gold Watch", rentprice: "$24.45", sellprice: '$60.80', days: "5 days", image: serviceImg[1] },
        { id: 6, rentquantity: 1, sellQuantity:1, name: "Green Blazers", rentprice: "$24.45", sellprice: '$60.80', days: "5 days", image: serviceImg[2] },
        { id: 7, rentquantity: 1, sellQuantity:1, name: "Shorts", rentprice: "$24.45", sellprice: '$60.80', days: "5 days", image: serviceImg[0] },
        { id: 8, rentquantity: 1, sellQuantity:1, name: "Red Shirt", rentprice: "$24.45", sellprice: '$60.80', days: "5 days", image: serviceImg[1] },
        { id: 9, rentquantity: 1, sellQuantity:1, name: "Gold Watch", rentprice: "$24.45", sellprice: '$60.80', days: "5 days", image: serviceImg[2] },
        { id: 10, rentquantity: 1, sellQuantity:1, name: "Green Blazers", rentprice: "$24.45", sellprice: '$60.80', days: "5 days", image: serviceImg[0] },
        { id: 11, rentquantity: 1, sellQuantity:1, name: "Shorts", rentprice: "$24.45", sellprice: '$60.80', days: "5 days", image: serviceImg[2] },
      ],
      indiaStatesAndUTs: [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Jammu and Kashmir",
        "Ladakh",
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Lakshadweep",
        "Delhi",
        "Puducherry"
      ],
      serviceProvideIn:['Delhi']
};

  const productSlice = createSlice({
    name: 'rentProduct',
    initialState,
    reducers:{
        currentRentProduct: (state, action)=>{
            state.rentProduct = action.payload;
        }, 
    }
  });

  export const {currentRentProduct} = productSlice.actions;

  export default productSlice.reducer;