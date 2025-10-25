import { createApi } from "@reduxjs/toolkit/query/react";
// Assuming you have these defined in a baseApi file
import { baseQueryWithReauth, TAG_TYPES } from "./baseApi";

// Define a specific tag type for quotations
const QUOTATION_TAG = "Quotations";

export const quotationsApi = createApi({
  reducerPath: "quotationsApi",
  baseQuery: baseQueryWithReauth, // Use the base query with re-authentication
  tagTypes: [QUOTATION_TAG, TAG_TYPES.DASHBOARD, "CustomQuotation"], // Add specific tags

  endpoints: (builder) => ({
    // GET all quotations with pagination and search (assuming similar structure to items/suppliers)
    getQuotations: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/quotations/", // Assuming endpoint '/quotations/'
        params: { page, limit, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: QUOTATION_TAG, id })), // Map over results
              { type: QUOTATION_TAG, id: "LIST" },
            ]
          : [{ type: QUOTATION_TAG, id: "LIST" }],
      transformResponse: (response) => ({
        // Adapt to { count, results } structure
        data: response.results || [],
        total: response.count || 0,
      }),
    }),

    // GET single quotation by ID
    getQuotationById: builder.query({
      query: (id) => `/quotations/${id}/`, // Add trailing slash if needed
      providesTags: (result, error, id) => [{ type: QUOTATION_TAG, id }],
    }),

    // POST create new quotation
    createQuotation: builder.mutation({
      // The body will likely be an object containing quotation details and items
      query: (newQuotationData) => ({
        url: "/quotations/", // Add trailing slash
        method: "POST",
        body: newQuotationData, // Send as JSON
      }),
      // Invalidate the list to refetch after creation
      invalidatesTags: [
          { type: QUOTATION_TAG, id: "LIST" },
          { type: TAG_TYPES.DASHBOARD, id: "STATS" } // Invalidate dashboard if needed
      ],
    }),

    // PUT or PATCH update quotation status or details
    updateQuotation: builder.mutation({
      // Expects an object like { id, body } where body contains updated fields
      query: ({ id, body }) => ({
        url: `/quotations/${id}/`, // Add trailing slash
        method: "PATCH", // Or PUT
        body: body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: QUOTATION_TAG, id },
        { type: QUOTATION_TAG, id: "LIST" },
      ],
    }),

    // DELETE quotation
    deleteQuotation: builder.mutation({
      query: (id) => ({
        url: `/quotations/${id}/`, // Add trailing slash
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: QUOTATION_TAG, id },
        { type: QUOTATION_TAG, id: "LIST" },
        { type: TAG_TYPES.DASHBOARD, id: "STATS" }, // Invalidate dashboard if needed
      ],
    }),

    // GET custom quotation data (supplier/product pricing)
    getCustomQuotationData: builder.query({
      query: () => ({
        url: '/custom-quotation', // Ensure trailing slash if needed
        method: 'GET',
      }),
      transformResponse: (response) => {
        return response || {}; // Return the object or an empty one if error
      },
      providesTags: [{ type: 'CustomQuotation', id: 'ALL' }],
    }),

  }),
});

// Export the auto-generated hooks
export const {
  useGetQuotationsQuery,
  useGetQuotationByIdQuery,
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useDeleteQuotationMutation,
  useGetCustomQuotationDataQuery, // Your custom hook
  useLazyGetQuotationsQuery,
  useLazyGetQuotationByIdQuery,
} = quotationsApi;

// --- Don't forget to add this quotationsApi to your store configuration! ---