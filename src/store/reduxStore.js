import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./AuthReducer";

const store = configureStore({
    reducer:{
        auth:authSlice.reducer,
    }
})

export default store;