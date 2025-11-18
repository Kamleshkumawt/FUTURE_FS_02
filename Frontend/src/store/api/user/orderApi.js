import { baseApi } from "../baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: `/order/auth/create`,
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),
    getMyOrders: builder.query({
      query: () => `/order/auth/my-orders`,
      providesTags: ["Orders"],
    }),

    getSellerOrders: builder.query({
      query: () => `/order/auth/seller/orders`,
      providesTags: ["SellerOrders"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/order/seller/update-status/${orderId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["SellerOrders"],
    }),

    getSellerOrderStats: builder.query({
      query: () => `/order/auth/seller/stats`,
      providesTags: ["SellerStats"],
    }),

    getOrdersByStatusForSeller: builder.query({
      query: () => `/order/auth/seller/all/stats`,
      providesTags: ["SellerStats"],
    }),

    getSellerIncome: builder.query({
      query: () => `/order/auth/seller/income`,
      providesTags: ["SellerIncome"],
    }),

  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetSellerOrderStatsQuery,
  useGetSellerIncomeQuery,
  useGetOrdersByStatusForSellerQuery
} = orderApi;
