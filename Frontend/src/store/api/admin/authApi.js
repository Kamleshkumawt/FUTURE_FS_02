import { baseApi } from '../baseApi';

export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: '/admin/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    registerAdmin: builder.mutation({
      query: (credentials) => ({
        url: '/admin/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    logoutAdmin: builder.mutation({
      query: () => ({
        url: "/admin/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Admin"],
    }),

    // ======= PROFILE =======

    getAdminProfile: builder.query({
      query: () => "/admin/auth/me",
      providesTags: ["Admin"],
    }),

    updateAdminDetails: builder.mutation({
      query: (data) => ({
        url: "/admin/auth/update-details",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),

    changeAdminPassword: builder.mutation({
      query: (data) => ({
        url: "/admin/auth/change-password",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useRegisterAdminMutation,
  useLogoutAdminMutation,
  useGetAdminProfileQuery,
  useUpdateAdminDetailsMutation,
  useChangeAdminPasswordMutation,
  
} = adminAuthApi;
