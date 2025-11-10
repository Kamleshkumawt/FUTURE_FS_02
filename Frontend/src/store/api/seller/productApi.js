import { baseApi } from "../baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =
    getProducts: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/product?${queryString}`;
      },
      providesTags: ["Products"],
    }),

    getProductBySlug: builder.query({
      query: (slug) => `/product/slug/${slug}`,
      providesTags: ["Products"],
    }),

    getAllProducts: builder.query({
      query: () => `/product/get/all`,
      providesTags: ["Products"],
    }),
    getProductsByCategory: builder.query({
      query: (categoryId) => `/product/category/${categoryId}`,
      providesTags: ["Products"],
    }),

    searchProducts: builder.query({
      query: (searchTerm) => `/product/search/${searchTerm}`,
      providesTags: ["Products"],
    }),

    // =
    getProductsBySeller: builder.query({
      query: () => `/product/get/sellerId`,
      providesTags: ["SellerProducts"],
    }),

    getProductStatusForSeller: builder.mutation({
      query: () => `/product/getProduct/status`,
      providesTags: ["SellerProducts"],
    }),

    // =
    createProduct: builder.mutation({
      query: (formData) => ({
        url: `/product/update/create-product`,
        method: "POST",
        body: formData, // multipart/form-data
      }),
      invalidatesTags: ["Products", "SellerProducts"],
    }),

    updateProduct: builder.mutation({
      query: (formData) => ({
        url: `/product/update/update-product`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Products", "SellerProducts"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/update/delete-product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "SellerProducts"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetAllProductsQuery,
  useGetProductBySlugQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useGetProductsBySellerQuery,
  useGetProductStatusForSellerMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;