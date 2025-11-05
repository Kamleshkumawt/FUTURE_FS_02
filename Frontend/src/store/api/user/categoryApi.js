import { baseApi } from '../baseApi';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
    getCategoryById: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: ['Categories'],
    }),
    getCategoryByParentId: builder.query({
      query: (id) => `/categories/parentId/${id}`,
      providesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryByParentIdQuery,
} = categoryApi;
