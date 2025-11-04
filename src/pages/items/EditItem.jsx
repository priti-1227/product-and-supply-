"use client"

import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Checkbox, // <-- Make sure Checkbox is imported
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import { useGetItemByIdQuery, useUpdateItemMutation } from "../../store/api/itemsApi"
import { useGetSuppliersQuery } from "../../store/api/suppliersApi"
import { useNotification } from "../../hooks/useNotification"
import { handleApiError } from "../../utils/errorHandler"
import { proxifyImageUrl } from "../../utils/urlUtils";

function EditItem() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { showNotification } = useNotification()

  const { data: item, isLoading: isLoadingItem } = useGetItemByIdQuery(id)
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useGetSuppliersQuery({ page: 1, limit: 100 })
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue, // <-- Get setValue for the image input
  } = useForm({  defaultValues: {
    supplier: '', // <-- This ensures the initial value is never undefined
    name: '',
    description: '',
    // Initialize other fields as well for consistency
    packing: '',
    currency: '',
    wholesale_price: '',
    retail_price: '',
    unit: '',
    country_of_origin: '',
    is_available: false,
  }})

  React.useEffect(() => {
    if (item && suppliersData) {
      reset({
        supplier: item.supplier,
        name: item.name,
        description: item.description,
        packing: item.packing,
        currency: item.currency,
        wholesale_price: item.wholesale_price,
        retail_price: item.retail_price,
        unit: item.unit,
        country_of_origin: item.country_of_origin,
        is_available: item.is_available,
      })
    }
  }, [item, suppliersData, reset]) // <-- Updated dependency array

  const onSubmit = async (data) => {
    // For file uploads on edit, you'd need FormData again.
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        // Only append the image if it's a new file object
        if (key === 'image' && data.image instanceof File) {
            formData.append('image', data.image);
        } else if (key !== 'image' && data[key] != null) {
            formData.append(key, data[key]);
        }
    });

    try {
      await updateItem({ id, formData }).unwrap()
      showNotification({ message: "Item updated successfully", type: "success" })
      navigate("/items")
    } catch (err) {
      handleApiError(err, showNotification)
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
  console.log(suppliers,"test suppliers")

  return (
    <Box>
      <Paper sx={{ p: 4, width: "100%" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/items")} sx={{ mb: 2 }}>
          Back to Items
        </Button>

        <Typography variant="h4" fontWeight={600} mb={3}>
          Edit Item
        </Typography>

        {/* 2. THIS IS THE COPIED AND ADAPTED FORM */}
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Supplier */}
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }} gap={3} mx="auto" sx={{ width: { xs: "100%", lg: "50%" } }} alignItems="center" justifyContent="center">
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>Supplier</Grid>
              <Grid item xs={6}>
                <Controller
  name="supplier"
  control={control}
  rules={{ required: "Supplier is required" }}
  render={({ field }) => (
    <TextField
      {...field}
      fullWidth
      select
      // label="Supplier"
      error={!!errors.supplier}
      helperText={errors.supplier?.message}
    >
      {/* Add a placeholder option in case the value is empty */}
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {suppliers.map((supplier) => (
        <MenuItem key={supplier.id} value={supplier.id}>
          {supplier.name}
        </MenuItem>
      ))}
    </TextField>
  )}
/>
              </Grid>
            </Box>

            {/* Item Name */}
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }} gap={3} mx="auto" sx={{ width: { xs: "100%", lg: "50%" } }} alignItems="center" justifyContent="center">
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>Item Name</Grid>
              <Grid item xs={6}>
                <TextField fullWidth {...register("name", { required: "Item name is required" })} error={!!errors.name} helperText={errors.name?.message} placeholder="Item Name"/>
              </Grid>
            </Box>

            {/* Description */}
            <Box display={"grid"} gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }} gap={3} mx={"auto"} sx={{ width: { xs: "100%", lg: "50%" } }} alignItems={"center"} justifyContent={"center"}>
              <Grid sx={{ width: "100%", display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>Description</Grid>
              <Grid item xs={6}>
                <TextField fullWidth multiline rows={2} {...register("description")} placeholder="Description" error={!!errors.description} helperText={errors.description?.message}/>
              </Grid>
            </Box>

            {/* Packing */}
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }} gap={3} mx="auto" sx={{ width: { xs: "100%", lg: "50%" } }} alignItems="center" justifyContent="center">
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>Packing</Grid>
              <Grid item xs={6}>
                <TextField fullWidth {...register("packing")} error={!!errors.packing} helperText={errors.packing?.message} placeholder="e.g., Box of 10, Pack of 50"/>
              </Grid>
            </Box>

            {/* Currency */}
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }} gap={3} mx="auto" sx={{ width: { xs: "100%", lg: "50%" } }} alignItems="center" justifyContent="center">
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>Currency</Grid>
              <Grid item xs={6}>
                <TextField fullWidth type="text" maxLength={3} placeholder="e.g., USD, EUR" {...register("currency", { required: "Currency is required" })} error={!!errors.currency} helperText={errors.currency?.message}/>
              </Grid>
            </Box>

            {/* Wholesale Price */}
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }} gap={3} mx="auto" sx={{ width: { xs: "100%", lg: "50%" } }} alignItems="center" justifyContent="center">
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>Wholesale Price</Grid>
              <Grid item xs={6}>
                <TextField fullWidth type="text" {...register("wholesale_price", { required: "Wholesale price is required" })} error={!!errors.wholesale_price} helperText={errors.wholesale_price?.message}/>
              </Grid>
            </Box>

            {/* Retail price */}
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }} gap={3} mx="auto" sx={{ width: { xs: "100%", lg: "50%" } }} alignItems="center" justifyContent="center">
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>Retail price</Grid>
              <Grid item xs={6}>
                <TextField fullWidth type="text" {...register("retail_price", { required: "Retail price is required" })} error={!!errors.retail_price} helperText={errors.retail_price?.message}/>
              </Grid>
            </Box>

            {/* Unit */}
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }} gap={3} mx="auto" sx={{ width: { xs: "100%", lg: "50%" } }} alignItems="center" justifyContent="center">
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>Unit</Grid>
              <Grid item xs={6}>
                <TextField fullWidth type="text" {...register("unit", { required: "Unit is required" })} error={!!errors.unit} helperText={errors.unit?.message}/>
              </Grid>
            </Box>

            {/* Country of origin */}
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }} gap={3} mx="auto" sx={{ width: { xs: "100%", lg: "50%" } }} alignItems="center" justifyContent="center">
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>Country of origin</Grid>
              <Grid item xs={6}>
                <TextField fullWidth {...register("country_of_origin")} placeholder="Country of origin" />
              </Grid>
            </Box>

            {/* Upload Image */}
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }} gap={3} mx="auto" sx={{ width: { xs: "100%", lg: "50%" } }} alignItems="center" justifyContent="center">
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>Upload Image</Grid>
              <Grid item xs={6}>
                                 {/* {item?.image && <img src={item.image} alt="Current item" style={{ width: 100, height: 100, marginBottom: 10, objectFit: 'cover' }} />} */}

                 {item?.image && <img src={proxifyImageUrl(item.image)} alt="Current item" style={{ width: 100, height: 100, marginBottom: 10, objectFit: 'cover' }} />}
 <TextField
      type="file"
      accept="image/*"
      // {...register("image")}
  //     onChange={(e) => {
  //   const file = e.target.files ? e.target.files[0] : null;
  //   setValue("image", file); // Stores the file object, not a Base64 string
  // }}
   onChange={(e) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (!file) {
          // No file selected, just set value to null
          setValue("image", null);
          return;
        }

        // --- This is the validation check ---
        if (file.type.startsWith("image/")) {
          // Valid image file
          setValue("image", file); // Stores the file object
        } else {
          // Invalid file type
          showNotification({ 
            message: "Invalid file type. Please upload a valid image (e.g., PNG, JPG).", 
            type: "error" 
          });
          setValue("image", null); // Set form value to null
          e.target.value = null; // Clear the file input so the user can re-select
        }
      }}
      style={{ width: "100%" }}
    />              </Grid>
            </Box>

            {/* Is Available */}
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }} gap={3} mx="auto" sx={{ width: { xs: "100%", lg: "50%" } }} alignItems="center" justifyContent="center">
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>Is Available</Grid>
              <Grid item xs={6}>
              <Controller
      name="is_available"
      control={control}
      render={({ field }) => (
        <Checkbox
          checked={field.value} // Use field.value to set the checked state
          onChange={field.onChange} // Use field.onChange to update the form state
        />
      )}
    />
              </Grid>
            </Box>
            
            {/* Buttons */}
            <Box display="grid" gridTemplateColumns="1fr" gap={3} mx="auto" sx={{ width: { xs: "100%", lg: "50%" } }}>
              <Grid item>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, width: "100%" }}>
                  <Button variant="outlined" onClick={() => navigate("/items")} disabled={isUpdating}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={isUpdating}>
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