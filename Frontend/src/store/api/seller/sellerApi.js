// src/features/seller/sellerApi.js
import { baseApi } from '../baseApi';

export const sellerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSellerProducts: builder.query({
      query: () => '/seller/products',
      providesTags: ['Product'],
    }),
    getSellerProfile: builder.mutation({
      query: () => '/seller/auth/me',
      providesTags: ['User'],
    }),
    updateSellerProfile: builder.mutation({
      query: (data) => ({
        url: '/seller/auth/update',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Seller'],
    }),
    updateSellerPass: builder.mutation({
      query: (data) => ({
        url: '/seller/auth/update-pass',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Seller'],
    }),
    addProduct: builder.mutation({
      query: (productData) => ({
        url: '/seller/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const { useGetSellerProductsQuery, useGetSellerProfileMutation, useAddProductMutation, useUpdateSellerProfileMutation, useUpdateSellerPassMutation } = sellerApi;
