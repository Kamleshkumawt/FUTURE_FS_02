import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  seller: null,
  admin: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('token'), // Set to true if token exists
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
          const { user, token, refreshToken } = action.payload;
          state.user = user;
          state.token = token;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
          state.error = null;
            
          // Store in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = null;
            state.isLoading = false;
                // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
        setLoading: (state, action) => {
          state.isLoading = action.payload;
        },
        setError: (state, action) => {
          state.error = action.payload;
        },
        setUser: (state, action) => {
          state.user = action.payload;
          state.isLoading = false;
        },
        clearUser: (state) => {
          state.user = null;
          state.isLoading = false;
        },
        setSellerUser: (state, action) => {
          state.seller = action.payload;
          state.isLoading = false;
        },
        clearSellerUser: (state) => {
          state.seller = null;
          state.isLoading = false;
        },
        setAdminUser: (state, action) => {
          state.admin = action.payload;
          state.isLoading = false;
        },
        clearAdminUser: (state) => {
          state.admin = null;
          state.isLoading = false;
        }
    },
});

export const {logout,setCredentials, setLoading, setError, setUser,clearUser ,setSellerUser ,clearSellerUser,setAdminUser,clearAdminUser } = authSlice.actions;
export default authSlice.reducer;