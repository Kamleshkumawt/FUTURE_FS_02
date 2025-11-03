import { baseApi } from '../../app/baseApi';

export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/admin/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: '/admin/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
} = adminAuthApi;
