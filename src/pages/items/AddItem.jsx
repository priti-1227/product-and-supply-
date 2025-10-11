"use client"

import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Box, Typography, Paper, TextField, Button, Grid, MenuItem } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import { useCreateItemMutation } from "../../store/api/itemsApi"
import { useGetSuppliersQuery } from "../../store/api/suppliersApi"
import { useNotification } from "../../hooks/useNotification"
import { handleApiError } from "../../utils/errorHandler"
const USE_DUMMY_DATA = true;
function AddItem() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const { data: suppliersData } = useGetSuppliersQuery({ page: 1, limit: 100 })
  const suppliers = suppliersData?.data || []

  const [createItem, { isLoading }] = useCreateItemMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  //  const [suppliers, setSuppliers] = useState([]);
   

  const onSubmit = async (data) => {
     if (USE_DUMMY_DATA) {
      try {
        const storedItems = JSON.parse(localStorage.getItem("dummyProducts") || "[]");
        const newItem = {
          ...data,
          id: Date.now(), // Create a simple unique ID
          // Ensure prices are numbers
          price: parseFloat(data.price),
          unitPrice: parseFloat(data.unitPrice),
          wholesalePrice: parseFloat(data.wholesalePrice),
          actualPrice: parseFloat(data.actualPrice),
        };
        const updatedItems = [...storedItems, newItem];
        localStorage.setItem("dummyProducts", JSON.stringify(updatedItems));
        
        showNotification({ message: "Item saved to local storage", type: "success" });
        navigate("/items"); // Assuming you have an /items route
      } catch (err) {
        showNotification({ message: "Failed to save dummy data", type: "error" });
        console.error(err);
      }
    } else {
    try {
      await createItem(data).unwrap()
      showNotification({
        message: "Item created successfully",
        type: "success",
      })
      navigate("/items")
    } catch (err) {
      handleApiError(err, showNotification)
    }
  }}

  return (
    <Box>
      <Paper sx={{ p: 4, width: "100%" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/items")} sx={{ mb: 2 }}>
          Back to Items
        </Button>

        <Typography variant="h4" fontWeight={600} mb={3}>
          Add New Item
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
              justifyContent="center"
            >
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Item Name
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  {...register("name", { required: "Item name is required" })}
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
              justifyContent="center"
            >
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Unique ID
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  {...register("uniqueId", { required: "Unique ID is required" })}
                  error={!!errors.uniqueId}
                  helperText={errors.uniqueId?.message}
                  placeholder="ITM001"
                />
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
              justifyContent="center"
            >
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Supplier
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  defaultValue=""
                  {...register("supplierId",
                    //  { required: "Supplier is required" }
                    )}
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
              alignItems="center"
              justifyContent="center"
            >
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Packaging
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  {...register("packaging")}
                  placeholder="e.g., Box of 10, Pack of 50"
                />
              </Grid>
            </Box>

            {/* Unit Price */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems="center"
              justifyContent="center"
            >
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Unit Price
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  {...register("unitPrice", { required: "Unit price is required" })}
                  error={!!errors.unitPrice}
                  helperText={errors.unitPrice?.message}
                  InputProps={{ startAdornment: "$" }}
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
              alignItems="center"
              justifyContent="center"
            >
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Wholesale Price
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  {...register("wholesalePrice", { required: "Wholesale price is required" })}
                  error={!!errors.wholesalePrice}
                  helperText={errors.wholesalePrice?.message}
                  InputProps={{ startAdornment: "$" }}
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
              alignItems="center"
              justifyContent="center"
            >
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Actual Price
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  {...register("actualPrice", { required: "Actual price is required" })}
                  error={!!errors.actualPrice}
                  helperText={errors.actualPrice?.message}
                  InputProps={{ startAdornment: "$" }}
                />
              </Grid>
            </Box>

            {/* Origin */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems="center"
              justifyContent="center"
            >
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Origin
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth {...register("origin")} placeholder="Country of origin" />
              </Grid>
            </Box>

            {/* QR/ID Code */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems="center"
              justifyContent="center"
            >
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                QR/ID Code
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth {...register("qrId")} placeholder="Barcode or QR code" />
              </Grid>
            </Box>
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems="center"
              justifyContent="center"
            >
              <Grid
    sx={{
      display: "flex",
      flexDirection: { xs: "row", md: "row-reverse" },
      fontWeight: 600,
    }}
  >
    Upload Image
  </Grid>

  {/* File Input */}
  <Grid item xs={6}>
    <TextField
      type="file"
      accept="image/*"
      {...register("imageFile")}
      style={{ width: "100%" }}
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
              alignItems="center"
              justifyContent="center"
            >
              <Grid sx={{ display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Description
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth multiline rows={4} {...register("description")} placeholder="Detailed description of the item..." />
              </Grid>
            </Box>

            {/* Buttons */}
            <Box display="grid" gridTemplateColumns="1fr" gap={3} mx="auto" sx={{ width: { xs: "100%", lg: "50%" } }}>
              <Grid item>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, width: "100%" }}>
                  <Button variant="outlined" onClick={() => navigate("/items")} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Item"}
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

export default AddItem
