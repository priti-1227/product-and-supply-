"use client"

import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import { useGetItemByIdQuery, useUpdateItemMutation } from "../../store/api/itemsApi"
import { useGetSuppliersQuery } from "../../store/api/suppliersApi"
import { useNotification } from "../../hooks/useNotification"

function EditItem() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { showSuccess, showError } = useNotification()

  const { data: item, isLoading: isLoadingItem } = useGetItemByIdQuery(id)
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useGetSuppliersQuery({ page: 1, limit: 100 })
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  React.useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        uniqueNo: item.uniqueNo,
        supplierId: item.supplierId,
        packaging: item.packaging,
        unitPrice: item.unitPrice,
        wholesalePrice: item.wholesalePrice,
        actualPrice: item.actualPrice,
        origin: item.origin,
        sku: item.sku,
        description: item.description,
        category: item.category,
        stock: item.stock,
        minStock: item.minStock,
      })
    }
  }, [item, reset])

  const onSubmit = async (data) => {
    try {
      await updateItem({ id, ...data }).unwrap()
      showSuccess("Item updated successfully")
      navigate("/items")
    } catch (error) {
      showError(error?.data?.message || "Failed to update item")
    }
  }

  if (isLoadingItem || isLoadingSuppliers) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  const suppliers = suppliersData?.data || []

  return (
    <Box>
      <Paper sx={{ p: 4, width: "100%" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/items")} sx={{ mb: 2 }}>
          Back to Items
        </Button>

        <Typography variant="h4" fontWeight={600} mb={3}>
          Edit Item
        </Typography>

        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Item Name */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems="center"
            >
              <Grid sx={{ display: "flex", flexDirection: "row-reverse", fontWeight: 600 }}>
                Item Name
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  {...register("name", { required: "Name is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="Item Name"
                />
              </Grid>
            </Box>

            {/* Unique ID */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems="center"
            >
              <Grid sx={{ display: "flex", flexDirection: "row-reverse", fontWeight: 600 }}>
                Unique ID
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth {...register("uniqueNo")} disabled />
              </Grid>
            </Box>

            {/* Supplier */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems="center"
            >
              <Grid sx={{ display: "flex", flexDirection: "row-reverse", fontWeight: 600 }}>
                Supplier
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  {...register("supplierId", { required: "Supplier is required" })}
                  error={!!errors.supplierId}
                  helperText={errors.supplierId?.message}
                >
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Box>

            {/* Packaging */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
            >
              <Grid sx={{ display: "flex", flexDirection: "row-reverse", fontWeight: 600 }}>
                Packaging
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth {...register("packaging")} placeholder="e.g., Box of 10" />
              </Grid>
            </Box>

            {/* Unit Price */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
            >
              <Grid sx={{ display: "flex", flexDirection: "row-reverse", fontWeight: 600 }}>
                Unit Price
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  {...register("unitPrice", { required: "Unit price is required" })}
                  error={!!errors.unitPrice}
                  helperText={errors.unitPrice?.message}
                />
              </Grid>
            </Box>

            {/* Wholesale Price */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
            >
              <Grid sx={{ display: "flex", flexDirection: "row-reverse", fontWeight: 600 }}>
                Wholesale Price
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  {...register("wholesalePrice", { required: "Wholesale price is required" })}
                  error={!!errors.wholesalePrice}
                  helperText={errors.wholesalePrice?.message}
                />
              </Grid>
            </Box>

            {/* Actual Price */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
            >
              <Grid sx={{ display: "flex", flexDirection: "row-reverse", fontWeight: 600 }}>
                Actual Price
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  {...register("actualPrice", { required: "Actual price is required" })}
                  error={!!errors.actualPrice}
                  helperText={errors.actualPrice?.message}
                />
              </Grid>
            </Box>

            {/* Description */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
            >
              <Grid sx={{ display: "flex", flexDirection: "row-reverse", fontWeight: 600 }}>
                Description
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth multiline rows={4} {...register("description")} placeholder="Item description..." />
              </Grid>
            </Box>

            {/* Buttons */}
            <Box
              display="grid"
              gridTemplateColumns="1fr"
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
            >
              <Grid item>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <Button variant="outlined" onClick={() => navigate("/items")} disabled={isUpdating}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={isUpdating ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Item"}
                  </Button>
                </Box>
              </Grid>
            </Box>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}

export default EditItem
