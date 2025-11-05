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
        
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
            state.loading = false;
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = null;
            state.loading = false;
                // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
        updateUser: (state, action) => {
          if (state.user) {
            state.user = { ...state.user, ...action.payload };
          }
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

export const { login, logout,setCredentials, updateUser, setLoading, setError, setUser,clearUser ,setSellerUser ,clearSellerUser,setAdminUser,clearAdminUser } = authSlice.actions;
export default authSlice.reducer;