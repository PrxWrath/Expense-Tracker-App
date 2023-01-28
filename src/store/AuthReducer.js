import {createSlice} from '@reduxjs/toolkit';

const token = localStorage.getItem('LOGIN_TOKEN');
const rows = localStorage.getItem('ROWS_PER_PAGE')
const initialState = {isLoggedIn: !!token, loginToken:token, premiumUser: token, rows: rows};

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
        },
        setRowsPerPage(state,action){
            state.rows = action.payload.rows;
            localStorage.setItem('ROWS_PER_PAGE', state.rows);
        }
    }
})

export const authActions = authSlice.actions;
export default authSlice;