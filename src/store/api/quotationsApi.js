import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, TAG_TYPES } from "./baseApi"; // Ensure TAG_TYPES.QUOTATIONS is defined here

// Add 'CustomQuotation' and 'SupplierWiseProducts' if they aren't in baseApi
const validTagTypes = [
    TAG_TYPES.QUOTATIONS,
    TAG_TYPES.DASHBOARD,
    "CustomQuotation",
    "SupplierWiseProducts"
];

export const quotationsApi = createApi({
  reducerPath: "quotationsApi",
  baseQuery: baseQueryWithReauth,
  // Ensure all used tag types are declared here
  tagTypes: validTagTypes,

  // ✅ Added the endpoints key and builder function
  endpoints: (builder) => ({
    getQuotations: builder.query({
      query: () => "/custom-quotation", // Assuming this is the correct GET list endpoint
providesTags: (result) => { // 'result' here is { data: [...], total: ... }
  // Check if data exists and is an array before mapping
  if (result?.data && Array.isArray(result.data)) {
    return [
      // Map over the actual array inside result.data
      ...result.data.map(({ id }) => ({ type: TAG_TYPES.QUOTATIONS, id })),
      { type: TAG_TYPES.QUOTATIONS, id: "LIST" },
    ];
  }
  // Fallback if no data or data is not an array
  return [{ type: TAG_TYPES.QUOTATIONS, id: "LIST" }];
},

     transformResponse: (response) => {
  console.log("priti --- Inside transformResponse ---");
  console.log("priti Raw API Response received:", response);
  console.log("priti Is response an array?", Array.isArray(response));

  // Ensure the response is actually an array before trying to use .length
  if (!Array.isArray(response)) {
    console.error("❌ transformResponse Error: Expected array, got:", typeof response, response);
    // Return default structure on error
    return { data: [], total: 0 };
  }

  // If it's an array, proceed
  const transformed = {
    data: response, // Use the array directly
    total: response.length, // Get length from the array
  };
  console.log("Data being returned by transformResponse:", transformed);
  return transformed;
},
    }),

    // GET single quotation by ID
    getQuotationById: builder.query({
      query: (id) => `/quotations/${id}/`, // Assuming a different endpoint for single item
      // ✅ Corrected tag type reference
      providesTags: (result, error, id) => [{ type: TAG_TYPES.QUOTATIONS, id }],
    }),

    // POST create new quotation
    createQuotation: builder.mutation({
      query: (quotationData) => ({
        url: '/custom-quotation', // Use the correct POST endpoint
        method: 'POST',
        body: quotationData,
      }),
      // ✅ Corrected tag type reference
      invalidatesTags: [{ type: TAG_TYPES.QUOTATIONS, id: 'LIST' }, /* other tags */],
    }),

    // PUT or PATCH update quotation status or details
    updateQuotation: builder.mutation({
      query: ({ id, body }) => ({
        url: `/quotations/${id}/`, // Assuming a different endpoint for update
        method: "PATCH", // Or PUT
        body: body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: TAG_TYPES.QUOTATIONS, id },
        { type: TAG_TYPES.QUOTATIONS, id: "LIST" },
      ],
    }),

    // DELETE quotation
    deleteQuotation: builder.mutation({
      query: (id) => ({
        url: `/quotations/${id}/`, // Assuming a different endpoint for delete
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: TAG_TYPES.QUOTATIONS, id },
        { type: TAG_TYPES.QUOTATIONS, id: "LIST" },
        { type: TAG_TYPES.DASHBOARD, id: "STATS" },
      ],
    }),

    // GET custom quotation data (supplier/product pricing) - Duplicated? Check if needed
    getCustomQuotationData: builder.query({
       // Note: This seems redundant if getQuotations uses the same endpoint
      query: () => ({
        url: '/custom-quotation/',
        method: 'GET',
      }),
      transformResponse: (response) => {
        return response || {};
      },
      providesTags: [{ type: 'CustomQuotation', id: 'ALL' }],
    }),

    // GET supplier wise products
    getSupplierWiseProducts: builder.query({
      query: () => ({
        url: '/supplier-wise-product', // Added trailing slash based on pattern
        method: 'GET',
      }),
      transformResponse: (response) => {
        return response || {};
      },
      providesTags: [{ type: 'SupplierWiseProducts', id: 'ALL' }],
    }),

  }), // ✅ Closing parenthesis for endpoints builder
}); // ✅ Closing parenthesis for createApi

// Export the auto-generated hooks
export const {
  useGetQuotationsQuery,
  useGetQuotationByIdQuery,
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useDeleteQuotationMutation,
  useGetCustomQuotationDataQuery,
  useLazyGetQuotationsQuery,
  useLazyGetQuotationByIdQuery,
  useGetSupplierWiseProductsQuery,
} = quotationsApi;

// --- Don't forget to add this quotationsApi to your store configuration! ---