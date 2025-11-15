// src/features/user/userApi.js
import { baseApi } from "../baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => "/user/auth/profile",
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "/user/auth/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateUserProfilePassword: builder.mutation({
      query: (data) => ({
        url: "/user/auth/update-password",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    addNewAddress: builder.mutation({
      query: (data) => ({
        url: "/user/auth/add-address",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateAddress: builder.mutation({
      query: (data) => ({
        url: "/user/auth/update-address",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserProfilePasswordMutation,
  useAddNewAddressMutation,
  useUpdateAddressMutation,
} = userApi;
