import { baseApi } from '../baseApi';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => `/user/cart/get`,
      providesTags: ['Cart'],
    }),
    addItemToCart: builder.mutation({
      query: (data) => ({
        url: '/user/cart/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: (data ) => ({
        url: `/user/cart/update`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation({
      query: (productId) => ({
        url: `/user/cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: `/user/cart/clear`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddItemToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
