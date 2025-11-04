import { baseApi } from '../../app/baseApi';

export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: '/admin/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logoutAdmin: builder.mutation({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
      invalidatesTags: ["Admin"],
    }),

    // ======= PROFILE =======

    getAdminProfile: builder.query({
      query: () => "/admin/me",
      providesTags: ["Admin"],
    }),

    updateAdminDetails: builder.mutation({
      query: (data) => ({
        url: "/admin/update-details",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),

    changeAdminPassword: builder.mutation({
      query: (data) => ({
        url: "/admin/change-password",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useLogoutAdminMutation,
  
} = adminAuthApi;
