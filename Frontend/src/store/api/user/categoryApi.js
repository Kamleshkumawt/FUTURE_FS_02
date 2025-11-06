import { baseApi } from '../baseApi';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategoriesForSeller: builder.query({
      query: () => '/category/get/all',
      providesTags: ['Categories'],
    }),
    getAllCategories: builder.query({
      query: () => '/category/all',
      providesTags: ['Categories'],
    }),
    getCategoryById: builder.query({
      query: (id) => `/user/category/${id}`,
      providesTags: ['Categories'],
    }),
    getCategoryByParentId: builder.query({
      query: (id) => `/user/category/parentId/${id}`,
      providesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetAllCategoriesForSellerQuery,
  useGetCategoryByIdQuery,
  useGetCategoryByParentIdQuery,
} = categoryApi;
