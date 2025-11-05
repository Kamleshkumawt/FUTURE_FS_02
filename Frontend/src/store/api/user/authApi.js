// src/features/user/userAuthApi.js
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
  }),
});

export const {
  useUserLoginMutation,
  useUserRegisterMutation,
  useUserLogoutMutation,
} = userAuthApi;
