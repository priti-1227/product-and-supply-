import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseQuery = async (args, api, extraOptions) => {
  // Determine if args is a string (URL) or an object (query config)
  const rawArgs = typeof args === "string" ? { url: args } : args;

  const isFormData = rawArgs.body instanceof FormData;

  // ✅ Use fetchBaseQuery with proper header control
  const customBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://54.167.114.0/api/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) headers.set("authorization", `Bearer ${token}`);

      // ❌ Don't set Content-Type if it's FormData (browser does it automatically)
      if (!isFormData) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  });

  return customBaseQuery(rawArgs, api, extraOptions);
};

// Base query with re-authentication logic (Your code is fine here)
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

// Common tag types for cache invalidation (Your code is fine here)
export const TAG_TYPES = {
  SUPPLIERS: "Suppliers",
  ITEMS: "Items",
  QUOTATIONS: "Quotations",
  SUPPLIER_LISTS: "SupplierLists",
  DASHBOARD: "Dashboard",
}