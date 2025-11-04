import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseApi"; // Use your main baseQuery, not baseQueryWithReauth

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    // This is the endpoint your backend will have, e.g., /api/token/
    login: builder.mutation({
      query: (credentials) => ({
        url: "login/", // Adjust to your actual login/token URL
        method: "POST",
        body: credentials,
      }),
    }),
    // You can also add endpoints for register, forgot-password, etc.
  }),
});

// Export the hook for the login mutation
export const { useLoginMutation } = authApi;