import {createSlice} from '@reduxjs/toolkit';

const email = localStorage.getItem('EMAIL');
const initialState = {isLoggedIn: !!email, loginEmail:email};

const authSlice = createSlice({
    name:'Authentication',
    initialState,
    reducers:{
        login(state, action){
            state.loginEmail = action.payload.email;
            localStorage.setItem('EMAIL', action.payload.email);
            state.isLoggedIn = true;
        },
        logout(state){
            state.email = '';
            state.isLoggedIn = false;
            localStorage.clear();
        }
    }
})

export const authActions = authSlice.actions;
export default authSlice;