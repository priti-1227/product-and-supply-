import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth, TAG_TYPES } from "./baseApi"

export const itemsApi = createApi({
  reducerPath: "itemsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [TAG_TYPES.ITEMS, TAG_TYPES.DASHBOARD],
  endpoints: (builder) => ({
    // GET all items with filters
// in src/store/api/itemsApi.js

getItems: builder.query({
  // 1. Updated query: No longer sends pagination/search params
  //    (unless your API *does* filter the flat array on the backend?)
  //    If it does filter, keep the params. If not, simplify:
  query: () => "/products/",

  // 2. providesTags is likely correct, it expects the object from transformResponse
  providesTags: (result) =>
    result
      ? [...result.data.map(({ id }) => ({ type: TAG_TYPES.ITEMS, id })), { type: TAG_TYPES.ITEMS, id: "LIST" }]
      : [{ type: TAG_TYPES.ITEMS, id: "LIST" }],

  // 3. --- THIS IS THE FIX ---
  //    Transform the flat array response into the object your component expects
  transformResponse: (response) => { // 'response' is the flat array [...]
    return {
      data: response || [], // Put the array into the 'data' key
      total: response?.length || 0, // Calculate total from the array's length
    };
  },
}),

    // GET single item by ID
    getItemById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: TAG_TYPES.ITEMS, id }],
    }),

    // POST create new item
    createItem: builder.mutation({
      query: (formData) => ({
        url: "/products/",
        method: "POST",
        body: formData,
       
      }),
  
      invalidatesTags: [
        { type: TAG_TYPES.ITEMS, id: "LIST" },
        { type: TAG_TYPES.DASHBOARD, id: "STATS" },
      ],
    }),

    // PUT update item
 updateItem: builder.mutation({
  query: ({ id, formData }) => ({
    url: `/products/${id}/`,
    method: "PUT",
    body: formData, // send FormData directly
  }),
  invalidatesTags: (result, error, { id }) => [
    { type: TAG_TYPES.ITEMS, id },
    { type: TAG_TYPES.ITEMS, id: "LIST" },
  ],
}),
uploadProducts: builder.mutation({
      query: (formData) => ({
        url: "/product-upload", // Your endpoint
        method: "POST",
        body: formData, // This is the FormData object
      }),
      // After upload, refetch the entire items list
      invalidatesTags: [{ type: TAG_TYPES.ITEMS, id: "LIST" }],
    }),

    // DELETE item
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: TAG_TYPES.ITEMS, id },
        { type: TAG_TYPES.ITEMS, id: "LIST" },
        { type: TAG_TYPES.DASHBOARD, id: "STATS" },
      ],
    }),

    // BULK DELETE items
    bulkDeleteItems: builder.mutation({
      query: (ids) => ({
        url: "/products/bulk-delete",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [
        { type: TAG_TYPES.ITEMS, id: "LIST" },
        { type: TAG_TYPES.DASHBOARD, id: "STATS" },
      ],
    }),

    // POST upload item images
    uploadItemImages: builder.mutation({
      query: ({ itemId, formData }) => ({
        url: `/products/${itemId}/images`,
        method: "POST",
        body: formData,
        // Don't set Content-Type for FormData - browser will set it with boundary
        prepareHeaders: (headers) => {
          headers.delete("Content-Type")
          return headers
        },
      }),
      invalidatesTags: (result, error, { itemId }) => [{ type: TAG_TYPES.ITEMS, id: itemId }],
    }),

    // GET items by supplier
    getItemsBySupplier: builder.query({
      query: (supplierId) => `/products/supplier/${supplierId}`,
      providesTags: (result, error, supplierId) => [{ type: TAG_TYPES.ITEMS, id: `SUPPLIER_${supplierId}` }],
    }),
  }),
})

export const {
  useGetItemsQuery,
  useGetItemByIdQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useBulkDeleteItemsMutation,
  useUploadItemImagesMutation,
  useGetItemsBySupplierQuery,
  useLazyGetItemsQuery,
  useLazyGetItemByIdQuery,
  useUploadProductsMutation,
} = itemsApi
