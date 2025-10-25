import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { suppliersApi } from "./api/suppliersApi"
import { itemsApi } from "./api/itemsApi"
import { quotationsApi } from "./api/quotationsApi"
// import { supplierListApi } from "./api/supplierListApi"
import uiReducer from "./slices/uiSlice"
import { supplierListApi } from "./api/supplierListApi"

export const store = configureStore({
  reducer: {
    // RTK Query API reducers
    [suppliersApi.reducerPath]: suppliersApi.reducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
    [quotationsApi.reducerPath]: quotationsApi.reducer,
    [supplierListApi.reducerPath]: supplierListApi.reducer,

    // Regular slices
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(suppliersApi.middleware)
      .concat(itemsApi.middleware)
      .concat(quotationsApi.middleware)
      .concat(supplierListApi.middleware),
})

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)
