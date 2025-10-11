"use client"

import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import { useGetSupplierByIdQuery, useUpdateSupplierMutation } from "../../store/api/suppliersApi"
import { useNotification } from "../../hooks/useNotification"
import { handleApiError } from "../../utils/errorHandler"

function EditSupplier() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { showNotification } = useNotification()

  const { data: supplier, isLoading, isError, error } = useGetSupplierByIdQuery(id)
  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (supplier) reset(supplier)
  }, [supplier, reset])

  const onSubmit = async (data) => {
    try {
      await updateSupplier({ id, ...data }).unwrap()
      showNotification({ message: "Supplier updated successfully", type: "success" })
      navigate("/suppliers")
    } catch (err) {
      handleApiError(err, showNotification)
    }
  }

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )

  // if (isError)
  //   return (
  //     <Box>
  //       <Alert severity="error" sx={{ mb: 2 }}>
  //         {handleApiError(error)}
  //       </Alert>
  //       <Button variant="contained" onClick={() => navigate("/suppliers")}>
  //         Back to Suppliers
  //       </Button>
  //     </Box>
  //   )

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/suppliers")} sx={{ mb: 2 }}>
        Back to Suppliers
      </Button>

      <Typography variant="h4" fontWeight={600} mb={3}>
        Edit Supplier
      </Typography>

      <Paper sx={{ p: 4, width: "100%" }}>
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Unique ID */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems="center"
            >
              <Grid sx={{ width: "100%", display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Unique ID
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth {...register("uniqueId")} disabled />
              </Grid>
            </Box>

            {/* Supplier Name */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems="center"
            >
              <Grid sx={{ width: "100%", display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
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

            {/* Email */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems="center"
            >
              <Grid sx={{ width: "100%", display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Email
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  placeholder="Email"
                />
              </Grid>
            </Box>

            {/* Contact Number */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems="center"
            >
              <Grid sx={{ width: "100%", display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Contact Number
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  {...register("contactNo", { required: "Contact number is required" })}
                  error={!!errors.contactNo}
                  helperText={errors.contactNo?.message}
                  placeholder="Contact Number"
                />
              </Grid>
            </Box>

            {/* Status */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems="center"
            >
              <Grid sx={{ width: "100%", display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Status
              </Grid>
              <Grid item xs={6}>
                <TextField select fullWidth {...register("status")}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Box>

            {/* Other Details */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
              alignItems="center"
            >
              <Grid sx={{ width: "100%", display: "flex", flexDirection: { xs: "row", md: "row-reverse" }, fontWeight: 600 }}>
                Other Details
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  {...register("otherDetails")}
                  placeholder="Additional information about the supplier..."
                />
              </Grid>
            </Box>

            {/* Buttons */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr" }}
              gap={3}
              mx="auto"
              sx={{ width: { xs: "100%", lg: "50%" } }}
            >
              <Grid item>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, width: "100%" }}>
                  <Button variant="outlined" onClick={() => navigate("/suppliers")} disabled={isUpdating}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Supplier"}
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

export default EditSupplier
