"use client"

import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Box, Typography, Paper, TextField, Button, Grid, MenuItem } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import { useCreateSupplierMutation } from "../../store/api/suppliersApi"
import { useNotification } from "../../hooks/useNotification"
import { handleApiError } from "../../utils/errorHandler"
const USE_DUMMY_DATA = false;
function AddSupplier() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [createSupplier, { isLoading }] = useCreateSupplierMutation()

  const onSubmit = async (data) => {
    // --- NEW: Handle dummy data submission ---
     if (USE_DUMMY_DATA) {
      // --- DUMMY SUBMIT LOGIC ---
      try {
        // 1. Get the current list from localStorage
        const storedSuppliers = JSON.parse(localStorage.getItem("dummySuppliers") || "[]");

        // 2. Create the new supplier with a unique ID
        const newSupplier = {
          ...data,
          id: Date.now(), // Simple unique ID for dummy data
        };

        // 3. Add it to the list and save back to localStorage
        const updatedSuppliers = [...storedSuppliers, newSupplier];
        localStorage.setItem("dummySuppliers", JSON.stringify(updatedSuppliers));
        
        showNotification({ message: "Supplier saved to local storage", type: "success" });
        navigate("/suppliers");
      } catch (error) {
        console.error("Failed to save dummy supplier", error);
        showNotification({ message: "Failed to save dummy data", type: "error" });
      }
    } else{ // TILL HERE
    try {
      await createSupplier(data).unwrap()
      showNotification({
        message: "Supplier created successfully",
        type: "success",
      })
      navigate("/suppliers")
    } catch (err) {
      handleApiError(err, showNotification)
    }
  }
  }

  return (
    <Box>
    
     <Paper
  sx={{
    p: 4,
    width: "100%", // full width paper
  }}
>
    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/suppliers")} sx={{ mb: 2 }}>
        Back to Suppliers
      </Button>

      <Typography variant="h4" fontWeight={600} mb={3}>
        Add New Supplier
      </Typography>

  <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
  <Grid container
        spacing={3}>
    {/* <Box
      display={"grid"}
      gridTemplateColumns={{ xs: "1fr", md: "1fr  2fr" }}
      spacing={3}
      gap={3}
      mx={"auto"}
      sx={{width: { xs: "100%",  lg: "50%" }, }} 
      alignItems={"center"}
      justifyContent={"center"}
    >
 <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ width: "100%" }}
            
              display={"flex"}
              flexDirection={{xs:"row",md:"row-reverse"}}
            >
              Unique ID
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              {...register("uniqueId", { required: "Unique ID is required" })}
              error={!!errors.uniqueId}
              helperText={errors.uniqueId?.message}
              placeholder="SUP001"
            />
          </Grid>

    </Box> */}
    {/* NAME */}
    <Box
      display={"grid"}
      gridTemplateColumns={{ xs: "1fr", md: "1fr  2fr" }}
      spacing={3}
      gap={3}
      mx={"auto"}
      sx={{width: { xs: "100%",  lg: "50%" }, }} 
      alignItems={"center"}
      justifyContent={"center"}
    >
   <Grid variant="subtitle1"
              fontWeight={600}
              sx={{ width: "100%" }}
            
              display={"flex"}
              flexDirection={{xs:"row",md:"row-reverse"}} >
            
              Supplier Name
           
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              {...register("name", { required: "Supplier Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              placeholder="Supplier Name"
            />
          </Grid>

    </Box>
    {/* contact person */}
         <Box
  display={"grid"}
  gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
  gap={3}
  mx={"auto"}
  sx={{ width: { xs: "100%", lg: "50%" } }}
  alignItems={"center"}
  justifyContent={"center"}
>
  {/* Contact person Label */}
  <Grid
    sx={{
      width: "100%",
      display: "flex",
      flexDirection: { xs: "row", md: "row-reverse" },
      fontWeight: 600,
    }}
  >
    Contact Person
  </Grid>

  {/* Contact person Input */}
  <Grid item xs={6}>
    <TextField
      fullWidth
      {...register("contact_person", { required: "Contact person is required" })}
      error={!!errors.contact_person}
      helperText={errors.contact_person?.message}
      placeholder="Contact person "
      
    />
  </Grid>
</Box>
{/* Landline */}
         <Box
  display={"grid"}
  gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
  gap={3}
  mx={"auto"}
  sx={{ width: { xs: "100%", lg: "50%" } }}
  alignItems={"center"}
  justifyContent={"center"}
>
  {/* landline Label */}
  <Grid
    sx={{
      width: "100%",
      display: "flex",
      flexDirection: { xs: "row", md: "row-reverse" },
      fontWeight: 600,
    }}
  >
    Landline
  </Grid>

  {/* landline Input */}
  <Grid item xs={6}>
    <TextField
      fullWidth
      {...register("landline")}
      error={!!errors.landline}
      helperText={errors.landline?.message}
      placeholder="landline"
    />
  </Grid>
</Box>
    {/* mobile */}
         <Box
  display={"grid"}
  gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
  gap={3}
  mx={"auto"}
  sx={{ width: { xs: "100%", lg: "50%" } }}
  alignItems={"center"}
  justifyContent={"center"}
>
  {/* mobile Number Label */}
  <Grid
    sx={{
      width: "100%",
      display: "flex",
      flexDirection: { xs: "row", md: "row-reverse" },
      fontWeight: 600,
    }}
  >
    Mobile Number
  </Grid>

  {/* Mobile Input */}
  <Grid item xs={6}>
    <TextField
      fullWidth
      {...register("mobile", { required: "mobile number is required" })}
      error={!!errors.mobile}
      helperText={errors.mobile?.message}
      placeholder="mobile Number"
    />
  </Grid>
</Box>
{/* Email */}
    <Box
  display={"grid"}
  gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
  gap={3}
  mx={"auto"}
  sx={{ width: { xs: "100%", lg: "50%" } }}
  alignItems={"center"}
  justifyContent={"center"}
>
  {/* Email Label */}
  <Grid
    sx={{
      width: "100%",
      display: "flex",
      flexDirection: { xs: "row", md: "row-reverse" },
      fontWeight: 600,
    }}
  >
    Email
  </Grid>

  {/* Email Input */}
  <Grid item xs={6}>
    <TextField
      fullWidth
      type="email"
      {...register("email", {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      })}
      error={!!errors.email}
      helperText={errors.email?.message}
      placeholder="Email"
    />
  </Grid>
</Box>

{/* Whatsapp no */}

         <Box
  display={"grid"}
  gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
  gap={3}
  mx={"auto"}
  sx={{ width: { xs: "100%", lg: "50%" } }}
  alignItems={"center"}
  justifyContent={"center"}
>
  {/* whatsapp Number Label */}
  <Grid
    sx={{
      width: "100%",
      display: "flex",
      flexDirection: { xs: "row", md: "row-reverse" },
      fontWeight: 600,
    }}
  >
   whatsapp Number
  </Grid>

  {/* whatsapp Number Input */}
  <Grid item xs={6}>
    <TextField
      fullWidth
      {...register("whatsapp")}
      error={!!errors.contactNo}
      helperText={errors.contactNo?.message}
      placeholder="whatsapp Number"
    />
  </Grid>
</Box>
  {/* viber */}
    <Box
      display={"grid"}
      gridTemplateColumns={{ xs: "1fr", md: "1fr  2fr" }}
      spacing={3}
      gap={3}
      mx={"auto"}
      sx={{width: { xs: "100%",  lg: "50%" }, }} 
      alignItems={"center"}
      justifyContent={"center"}
    >
   <Grid variant="subtitle1"
              fontWeight={600}
              sx={{ width: "100%" }}
            
              display={"flex"}
              flexDirection={{xs:"row",md:"row-reverse"}} >
            
              Viber
           
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              {...register("viber")}
              error={!!errors.viber}
              helperText={errors.viber?.message}
              placeholder="viber"
            />
          </Grid>

    </Box>

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
    Address
  </Grid>

  {/* Other Details Input */}
  <Grid item xs={6}>
    <TextField
      fullWidth
      multiline
      rows={4}
      
      {...register("address", { required: "Address is required" })}
      placeholder="Address"
       error={!!errors.address}
              helperText={errors.address?.message}
    />
  </Grid>
</Box>
<Box
  display={"grid"}
  gridTemplateColumns={{ xs: "1fr" }}
  gap={3}
  mx={"auto"}
  sx={{ width: { xs: "100%", lg: "50%" } }}
>
  <Grid item>
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
        width: "100%",
      }}
    >
      <Button
        variant="outlined"
        onClick={() => navigate("/suppliers")}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        startIcon={<SaveIcon />}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Supplier"}
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

export default AddSupplier
