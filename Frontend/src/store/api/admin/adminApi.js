import { baseApi } from "../baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createCategory: builder.mutation({
      query: (data) => ({
        url: `/admin/category`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    getProductsBySellerId: builder.query({
      query: (id) => `/admin/seller/${id}`,
      providesTags: ["Product"],
    }),

    getAllUsers: builder.query({
      query: () => `/admin/users`,
      providesTags: ["User"],
    }),

    getAllSellers: builder.query({
      query: () => `/admin/sellers`,
      providesTags: ["Seller"],
    }),

    getAllProductsForAdmin: builder.query({
      query: () => `/admin/products`,
      providesTags: ["Product"],
    }),

    getAllOrders: builder.query({
      query: () => `/admin/orders/getAll`,
      providesTags: ["Order"],
    }),
    getAllDeliveredOrdersByAdminCount: builder.query({
      query: () => `/admin/orders/getAll/delivered`,
      providesTags: ["Order"],
    }),
    getAllCancelledOrdersByAdminCount: builder.query({
      query: () => `/admin/orders/getAll/cancelled`,
      providesTags: ["Order"],
    }),
    getAllOrdersByAdminCount: builder.query({
      query: () => `/admin/orders/getAll/count`,
      providesTags: ["Order"],
    }),
    getAllUsersByAdminCount: builder.query({
      query: () => `/admin/users/count`,
      providesTags: ["User"],
    }),
    getAllSellerByAdminCount: builder.query({
      query: () => `/admin/sellers/count`,
      providesTags: ["Seller"],
    }),
    getAllProductByAdminCount: builder.query({
      query: () => `/admin/products/count`,
      providesTags: ["Product"],
    }),

    updateOrderStatusByAdmin: builder.mutation({
      query: (data) => ({
        url: `/admin/orders/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    updateProductByAdmin: builder.mutation({
      query: (data) => ({
        url: `/admin/product/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    updateUserProfileByAdmin: builder.mutation({
      query: (data) => ({
        url: `/admin/user/update-profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateUserPasswordByAdmin: builder.mutation({
      query: (data) => ({
        url: `/admin/user/update-pass`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateSellerProfileByAdmin: builder.mutation({
      query: (data) => ({
        url: `/admin/seller/update-profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Seller"],
    }),

    updateSellerPasswordByAdmin: builder.mutation({
      query: (data) => ({
        url: `/admin/seller/update-pass`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Seller"],
    }),

    getUserById: builder.query({
      query: (id) => `/admin/user/getUserById/${id}`,
      providesTags: ["User"],
    }),

    getSellerById: builder.query({
      query: (id) => `/admin/seller/getSellerById/${id}`,
      providesTags: ["Seller"],
    }),

    getOrderById: builder.query({
      query: (id) => `/admin/orders/getById/${id}`,
      providesTags: ["Order"],
    }),

    blockUser: builder.mutation({
      query: (id) => ({
        url: `/admin/user/blocked/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    blockSeller: builder.mutation({
      query: (id) => ({
        url: `/admin/seller/blocked/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Seller"],
    }),


    deleteProductByAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/products/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  useGetProductsBySellerIdQuery,

  useGetAllUsersQuery,
  useGetAllSellersQuery,
  useGetAllProductsForAdminQuery,
  useGetAllOrdersQuery,

  useGetAllDeliveredOrdersByAdminCountQuery,
  useGetAllCancelledOrdersByAdminCountQuery,
  useGetAllUsersByAdminCountQuery,
  useGetAllSellerByAdminCountQuery,
  useGetAllProductByAdminCountQuery,
  useGetAllOrdersByAdminCountQuery,

  useUpdateOrderStatusByAdminMutation,
  useUpdateProductByAdminMutation,

  useUpdateUserProfileByAdminMutation,
  useUpdateUserPasswordByAdminMutation,
  useUpdateSellerProfileByAdminMutation,
  useUpdateSellerPasswordByAdminMutation,

  useGetUserByIdQuery,
  useGetSellerByIdQuery,
  useGetOrderByIdQuery,

  useBlockUserMutation,
  useBlockSellerMutation,

  useDeleteProductByAdminMutation,
} = adminApi;
