// src/redux/api/productApi.js
import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =

    getProducts: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/products?${queryString}`;
      },
      providesTags: ["Products"],
    }),

    getProductBySlug: builder.query({
      query: (slug) => `/products/slug/${slug}`,
      providesTags: ["Products"],
    }),

    getProductsByCategory: builder.query({
      query: (categoryId) => `/products/category/${categoryId}`,
      providesTags: ["Products"],
    }),

    searchProducts: builder.query({
      query: (searchTerm) => `/products/search/${searchTerm}`,
      providesTags: ["Products"],
    }),

    // =

    getProductsBySeller: builder.query({
      query: () => `/products/seller/me`,
      providesTags: ["SellerProducts"],
    }),

    getProductStatusForSeller: builder.query({
      query: () => `/products/seller/me/status`,
      providesTags: ["SellerProducts"],
    }),

    // =
    
    createProduct: builder.mutation({
      query: (formData) => ({
        url: `/products`,
        method: "POST",
        body: formData, // multipart/form-data
      }),
      invalidatesTags: ["Products", "SellerProducts"],
    }),

    updateProduct: builder.mutation({
      query: (formData) => ({
        url: `/products`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Products", "SellerProducts"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "SellerProducts"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useGetProductsBySellerQuery,
  useGetProductStatusForSellerQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
