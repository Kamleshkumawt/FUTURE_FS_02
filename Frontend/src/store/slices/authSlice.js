import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,          // user data
  token: null,         // access token
  refreshToken: null,  // refresh token
  role: null,          // 'user' | 'seller' | 'admin'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken, role } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.role = role;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.role = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
