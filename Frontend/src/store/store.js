import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "./slices/authSlice";
import categorySlice from "./slices/categorySlice";
import filterReducer from "./slices/productsFilterSlice";
import { baseApi } from "./api/baseApi";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        category: categorySlice,
        filters: filterReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false,
    }).concat(baseApi.middleware),
});

setupListeners(store.dispatch);