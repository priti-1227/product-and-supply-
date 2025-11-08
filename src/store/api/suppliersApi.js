import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth, TAG_TYPES } from "./baseApi"

export const suppliersApi = createApi({
  reducerPath: "suppliersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [TAG_TYPES.SUPPLIERS, TAG_TYPES.DASHBOARD],
  endpoints: (builder) => ({
 // GET all suppliers
getSuppliers: builder.query({
  // 1. The query is simplified. The API returns a full list, so no parameters are needed.
  query: () => "/suppliers/",

  // 2. This 'providesTags' is now correct.
  // 'result' will be the object { data: [...], total: ... } returned by transformResponse.
  providesTags: (result) =>
    result
      ? [
          ...result.data.map(({ id }) => ({ type: TAG_TYPES.SUPPLIERS, id })),
          { type: TAG_TYPES.SUPPLIERS, id: "LIST" },
        ]
      : [{ type: TAG_TYPES.SUPPLIERS, id: "LIST" }],

  // 3. This is the main fix.
  // It transforms the flat array [...] into the object { data: [...], total: ... }
  transformResponse: (response) => { // 'response' is the flat array [...]
    return {
      data: response || [], // Put the array into the 'data' key
      total: response?.length || 0, // Calculate total from the array's length
    };
  },
}),

    // GET single supplier by ID
    getSupplierById: builder.query({
      query: (id) => `/suppliers/${id}/`,
      providesTags: (result, error, id) => [{ type: TAG_TYPES.SUPPLIERS, id }],
    }),

    // POST create new supplier
    createSupplier: builder.mutation({
      query: (newSupplier) => ({
        url: "/suppliers/",
        method: "POST",
        body: newSupplier,
      }),
      invalidatesTags: [
        { type: TAG_TYPES.SUPPLIERS, id: "LIST" },
        { type: TAG_TYPES.DASHBOARD, id: "STATS" },
      ],
      // Optimistic update
      async onQueryStarted(newSupplier, { dispatch, queryFulfilled }) {
        try {
          const { data: createdSupplier } = await queryFulfilled
          // Update cache with new supplier
          dispatch(
            suppliersApi.util.updateQueryData("getSuppliers", { page: 1 }, (draft) => {
              draft.data.unshift(createdSupplier)
              draft.total += 1
            }),
          )
        } catch(error) {
            console.log("Create supplier failed: ", error)
        }
      },
    }),

    // PUT update supplier
    updateSupplier: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/suppliers/${id}/`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: TAG_TYPES.SUPPLIERS, id },
        { type: TAG_TYPES.SUPPLIERS, id: "LIST" },
      ],
      // Optimistic update
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          suppliersApi.util.updateQueryData("getSupplierById", id, (draft) => {
            Object.assign(draft, patch)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),

    // DELETE supplier
    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `/suppliers/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: TAG_TYPES.SUPPLIERS, id },
        { type: TAG_TYPES.SUPPLIERS, id: "LIST" },
        { type: TAG_TYPES.DASHBOARD, id: "STATS" },
      ],
    }),
    uploadSuppliers: builder.mutation({
      query: (formData) => ({
        url: "/supplier-upload", // Your endpoint
        method: "POST",
        body: formData, // This is the FormData object
        // The baseQuery will correctly handle the Content-Type
      }),
      // After a successful upload, invalidate the list to force a refetch
      invalidatesTags: [{ type: TAG_TYPES.SUPPLIERS, id: "LIST" }],
    }),

    // BULK DELETE suppliers
    bulkDeleteSuppliers: builder.mutation({
      query: (ids) => ({
        url: "/suppliers/bulk-delete",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [
        { type: TAG_TYPES.SUPPLIERS, id: "LIST" },
        { type: TAG_TYPES.DASHBOARD, id: "STATS" },
      ],
    }),

    // GET supplier statistics
    getSupplierStats: builder.query({
      query: () => "/suppliers/stats",
      providesTags: [{ type: TAG_TYPES.SUPPLIERS, id: "STATS" }],
    }),
  }),
})

export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useBulkDeleteSuppliersMutation,
  useGetSupplierStatsQuery,
  useLazyGetSuppliersQuery,
  useLazyGetSupplierByIdQuery,
  useUploadSuppliersMutation,
} = suppliersApi
