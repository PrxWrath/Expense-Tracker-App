import {createSlice} from '@reduxjs/toolkit';

const token = localStorage.getItem('LOGIN_TOKEN');
const initialState = {isLoggedIn: !!token, loginToken:token, premiumUser: token};

const authSlice = createSlice({
    name:'Authentication',
    initialState,
    reducers:{
        login(state, action){
            state.loginToken = action.payload.token;
            state.premiumUser = action.payload.premium;
            localStorage.setItem('LOGIN_TOKEN', state.loginToken);
            state.isLoggedIn = true;
        },
        logout(state){
            state.loginToken = '';
            state.isLoggedIn = false;
            localStorage.clear();
        },
        activatePremium(state){
            state.premiumUser = true;
        }
    }
})

export const authActions = authSlice.actions;
export default authSlice;