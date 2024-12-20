import { createSlice } from "@reduxjs/toolkit";

const initialState={
    isAuthenticated: false,
    user: null,
    SOLUTIONS_INFINI_API_URL:"https://api-voice.solutionsinfini.com/v1/",
    SOLUTIONS_INFINI_API_KEY:"A539b8a89ba294d176f01701f5ffd044f",
    KALYERA_API_URL:"https://api.kaleyra.io/v1/HXIN1751096165IN/messages",
    KALYERA_API_KEY:"A17d7d416a4abf01de27c9dc4107272ec",
    KALYERA_SENDER_NUMBER:"919094894948",
};

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        login: (state, action)=>{
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logOut: (state, action)=>{
            state.isAuthenticated=false;
            state.user =null;
        }
    }
});


export const {logOut, login} = authSlice.actions;

export default authSlice.reducer;