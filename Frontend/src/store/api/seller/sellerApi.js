// src/features/seller/sellerApi.js
import { baseApi } from '../../app/baseApi';

export const sellerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSellerProducts: builder.query({
      query: () => '/seller/products',
      providesTags: ['Product'],
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

export const { useGetSellerProductsQuery, useAddProductMutation } = sellerApi;
