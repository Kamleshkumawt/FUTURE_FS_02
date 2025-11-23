// src/features/user/userAuthApi.js
import { logout, setUser } from '../../slices/authSlice';
import { baseApi } from '../baseApi';

export const userAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userLogin: builder.mutation({
      query: (credentials) => ({
        url: '/user/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    userRegister: builder.mutation({
      query: (data) => ({
        url: '/user/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    userLogout: builder.mutation({
      query: () => ({
        url: '/user/auth/logout',
        method: 'POST',
      }),
    }),
    authMe: builder.query({
      query: () => "/user/auth/me",
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data.role === "user") {
            // console.log('user data:',data);
            dispatch(setUser(data.data));
          } else {
            // console.log('user can not login:',data);
            dispatch(logout());
          }
        } catch {
          dispatch(logout());
        }
      },
    }),
  }),
});

export const {
  useUserLoginMutation,
  useUserRegisterMutation,
  useUserLogoutMutation,
  useAuthMeQuery,
} = userAuthApi;
