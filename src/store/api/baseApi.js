import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Base query with authentication and error handling
export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://54.167.114.0/api/",
  prepareHeaders: (headers,) => {
    // Add authentication token if available
    const token = localStorage.getItem("authToken")
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    headers.set("Content-Type", "application/json")
    return headers
  },
})

// Base query with re-authentication logic
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  // Handle 401 Unauthorized - token expired
  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions)

    if (refreshResult.data) {
      // Store new token
      localStorage.setItem("authToken", refreshResult.data.token)
      // Retry original query
      result = await baseQuery(args, api, extraOptions)
    } else {
      // Refresh failed - logout user
      localStorage.removeItem("authToken")
      window.location.href = "/login"
    }
  }

  return result
}

// Common tag types for cache invalidation
export const TAG_TYPES = {
  SUPPLIERS: "Suppliers",
  ITEMS: "Items",
  QUOTATIONS: "Quotations",
  SUPPLIER_LISTS: "SupplierLists",
  DASHBOARD: "Dashboard",
}
