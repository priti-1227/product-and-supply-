import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth, TAG_TYPES } from "./baseApi"

export const supplierListApi = createApi({
  reducerPath: "supplierListApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [TAG_TYPES.SUPPLIER_LISTS],
  endpoints: (builder) => ({
    // POST upload supplier list (CSV/Excel)
    uploadSupplierList: builder.mutation({
      query: (formData) => ({
        url: "/supplier-list-upload",
        method: "POST",
        body: formData,
        prepareHeaders: (headers) => {
          headers.delete("Content-Type")
          return headers
        },
      }),
      invalidatesTags: [
        { type: TAG_TYPES.SUPPLIER_LISTS, id: "LIST" },
        { type: TAG_TYPES.SUPPLIERS, id: "LIST" },
        { type: TAG_TYPES.ITEMS, id: "LIST" },
      ],
    }),

    // GET all supplier list uploads
    getSupplierLists: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/supplier-lists",
        params: { page, limit },
      }),
      providesTags: [{ type: TAG_TYPES.SUPPLIER_LISTS, id: "LIST" }],
    }),

    // GET supplier list by ID
    getSupplierListById: builder.query({
      query: (id) => `/supplier-lists/${id}`,
      providesTags: (result, error, id) => [{ type: TAG_TYPES.SUPPLIER_LISTS, id }],
    }),

    // POST validate supplier list before import
    validateSupplierList: builder.mutation({
      query: (formData) => ({
        url: "/supplier-lists/validate",
        method: "POST",
        body: formData,
        prepareHeaders: (headers) => {
          headers.delete("Content-Type")
          return headers
        },
      }),
    }),

    // POST confirm import after validation
    confirmSupplierListImport: builder.mutation({
      query: ({ uploadId, mappings }) => ({
        url: "/supplier-lists/confirm-import",
        method: "POST",
        body: { uploadId, mappings },
      }),
      invalidatesTags: [
        { type: TAG_TYPES.SUPPLIER_LISTS, id: "LIST" },
        { type: TAG_TYPES.SUPPLIERS, id: "LIST" },
        { type: TAG_TYPES.ITEMS, id: "LIST" },
      ],
    }),
  }),
})

export const {
  useUploadSupplierListMutation,
  useGetSupplierListsQuery,
  useGetSupplierListByIdQuery,
  useValidateSupplierListMutation,
  useConfirmSupplierListImportMutation,
  
} = supplierListApi
