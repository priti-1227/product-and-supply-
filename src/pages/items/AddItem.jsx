"use client"

import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Box, Typography, Paper, TextField, Button, Grid, MenuItem, Checkbox } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import { useCreateItemMutation } from "../../store/api/itemsApi"
import { useGetSuppliersQuery } from "../../store/api/suppliersApi"
import { useNotification } from "../../hooks/useNotification"
import { handleApiError } from "../../utils/errorHandler"
const USE_DUMMY_DATA = false;
function AddItem() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const { data: suppliersData } = useGetSuppliersQuery({ page: 1, limit: 100 })
  const suppliers = suppliersData?.data || []
  console.log(suppliers,"test suppliers")

  const [createItem, { isLoading }] = useCreateItemMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },setValue
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
        const formData = new FormData();

  // 2. Append all form fields.
  Object.keys(data).forEach(key => {
    if (key === 'image' && data[key]) {
      // Append the actual file object
      formData.append('image', data.image);
    } else if (key !== 'image' && data[key] != null) {
      formData.append(key, data[key]);
    }
  });
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
                  {...register("supplier",{ required: "Supplier is required" }
                   
                    )}
                  error={!!errors.supplier}
                  helperText={errors.supplier?.message}
                >
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Box>

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
            {/* description */}
            <Box
              display={"grid"}
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx={"auto"}
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {/* Other Details Label */}
              <Grid
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: { xs: "row", md: "row-reverse" },
                  fontWeight: 600,
                }}
              >
                Description
              </Grid>
            
              {/* Other Details Input */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  
                  {...register("description")}
                  placeholder="Description"
                   error={!!errors.description}
                          helperText={errors.description?.message}
                />
              </Grid>
            </Box>

            {/* Packing */}
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
               Packing
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  {...register("packing")}
                  error={!!errors.packing}
                  helperText={errors.packing?.message}
                  placeholder="e.g., Box of 10, Pack of 50"
                />
              </Grid>
            </Box>


              {/* Currency */}
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
               Currency
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="text"
                  maxLength={3}
                  placeholder="e.g., USD, EUR"
                  {...register("currency", { required: "Currency is required" })}
                  error={!!errors.currency}
                  helperText={errors.currency?.message}
                  
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
                  type="text"
                  {...register("wholesale_price", { required: "Wholesale price is required" })}
                  error={!!errors.wholesale_price}
                  helperText={errors.wholesale_price?.message}
                  // InputProps={{ startAdornment: "$" }}
                />
              </Grid>
            </Box>

              {/* Retail price */}
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
                Retail price
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="text"
                  {...register("retail_price", { required: "Retail price is required" })}
                  error={!!errors.retail_price}
                  helperText={errors.retail_price?.message}
                  // InputProps={{ startAdornment: "$" }}
                />
              </Grid>
            </Box>

           

            {/* Unit  */}
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
                Unit 
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="text"
                  {...register("unit", { required: "Unit is required" })}
                  error={!!errors.unit}
                  helperText={errors.unit?.message}
                  // InputProps={{ startAdornment: "$" }}
                />
              </Grid>
            </Box>

           

           

            {/* Country of origin */}
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
                Country of origin
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth {...register("country_of_origin")} placeholder="Country of origin" />
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
      // {...register("image")}
      onChange={(e) => {
    const file = e.target.files ? e.target.files[0] : null;
    setValue("image", file); // Stores the file object, not a Base64 string
  }}
      style={{ width: "100%" }}
    />
     
  </Grid>
            </Box>

            {/* Is Available */}
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
                Is Available
              </Grid>
              <Grid item xs={6}>
                <Checkbox fullWidth   {...register("is_available")}  />
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
