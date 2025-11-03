// src/features/seller/sellerAuthApi.js
import { baseApi } from '../../app/baseApi';

export const sellerAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sellerLogin: builder.mutation({
      query: (credentials) => ({
        url: '/seller/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    sellerRegister: builder.mutation({
      query: (data) => ({
        url: '/seller/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    sellerLogout: builder.mutation({
      query: () => ({
        url: '/seller/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useSellerLoginMutation,
  useSellerRegisterMutation,
  useSellerLogoutMutation,
} = sellerAuthApi;
