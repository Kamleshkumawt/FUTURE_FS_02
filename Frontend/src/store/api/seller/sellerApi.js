// src/features/seller/sellerApi.js
import { baseApi } from '../baseApi';

export const sellerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSellerProducts: builder.query({
      query: () => '/seller/products',
      providesTags: ['Product'],
    }),
    getSellerProfile: builder.mutation({
      query: () => '/user/profile',
      providesTags: ['User'],
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

export const { useGetSellerProductsQuery, useGetSellerProfileMutation, useAddProductMutation } = sellerApi;
