import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth, TAG_TYPES } from "./baseApi"

export const itemsApi = createApi({
  reducerPath: "itemsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [TAG_TYPES.ITEMS, TAG_TYPES.DASHBOARD],
  endpoints: (builder) => ({
    // GET all items with filters
    getItems: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        supplierId = null,
        minPrice = null,
        maxPrice = null,
        sortBy = "createdAt",
        order = "desc",
      }) => ({
        url: "/products/",
        params: { page, limit, search, supplierId, minPrice, maxPrice, sortBy, order },
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: TAG_TYPES.ITEMS, id })), { type: TAG_TYPES.ITEMS, id: "LIST" }]
          : [{ type: TAG_TYPES.ITEMS, id: "LIST" }],
      transformResponse: (response) => ({
        data: response.items || response.data || [],
        total: response.total || 0,
        page: response.page || 1,
        totalPages: response.totalPages || 1,
      }),
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
      query: ({ id, ...patch }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: TAG_TYPES.ITEMS, id },
        { type: TAG_TYPES.ITEMS, id: "LIST" },
      ],
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
} = itemsApi
