import { baseApi } from '../baseApi';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (formData) => ({
        url: '/reviews',
        method: 'POST',
        body: formData, // formData must be multipart/form-data
      }),
      invalidatesTags: ['Reviews'],
    }),
    getReviewsByProductId: builder.query({
      query: (productId) => `/reviews/product/${productId}`,
      providesTags: ['Reviews'],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews'],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetReviewsByProductIdQuery,
  useDeleteReviewMutation,
} = reviewApi;
