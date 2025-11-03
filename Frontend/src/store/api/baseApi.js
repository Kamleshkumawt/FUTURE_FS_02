import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../slices/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl:'http://localhost:8000/api/xyz',
   credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    // headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   // Token expired or invalid
//   if (result?.error?.status === 401) {
//     const refreshToken = api.getState().auth?.refreshToken;

//     if (!refreshToken) {
//       api.dispatch(logout());
//       return result;
//     }

//     const refreshResult = await baseQuery(
//       {
//         url: '/auth/refresh',
//         method: 'POST',
//         body: { refreshToken },
//       },
//       api,
//       extraOptions
//     );

//     if (refreshResult?.data) {
//       api.dispatch(setCredentials(refreshResult.data));

//       // Retry original request with new token
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       api.dispatch(logout());
//     }
//   }

//   return result;
// };



// ✅ handles token refresh for any role (user/seller/admin)
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = api.getState().auth?.refreshToken;
    const role = api.getState().auth?.role;

    if (!refreshToken || !role) {
      api.dispatch(logout());
      return result;
    }

    // Refresh endpoint depends on role
    const refreshResult = await baseQuery(
      {
        url: `/${role}/auth/refresh`,
        method: 'POST',
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      api.dispatch(setCredentials({ ...refreshResult.data, role }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};


export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Product', 'Order', 'Seller', 'Admin'],
  endpoints: () => ({}),
});




