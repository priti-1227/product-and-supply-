import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, TAG_TYPES } from "./baseApi";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [TAG_TYPES.DASHBOARD], // Use the "Dashboard" tag
  
  endpoints: (builder) => ({
    // GET dashboard data
    getDashboardData: builder.query({
      query: () => "/dashboard", // Your API endpoint
      
      // Provides a tag that can be invalidated by other mutations (like createItem)
      providesTags: [{ type: TAG_TYPES.DASHBOARD, id: "STATS" }], 
    }),
  }),
});

// Export the auto-generated hook
export const { useGetDashboardDataQuery } = dashboardApi;