"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  LinearProgress,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { useUploadSupplierListMutation } from "../store/api/supplierListApi"
import { useNotification } from "../hooks/useNotification"

function SupplierListUpload() {
 const { showNotification } = useNotification()
  // This is your real API mutation hook
  const [uploadList, { isLoading }] = useUploadSupplierListMutation()

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return;

    try {
      // --- REAL API LOGIC ---
      const formData = new FormData();
      // Use the key your API expects: 'supplier_list'
      formData.append('supplier_list', file); 

      // 2. Call the mutation and get the response
      const response = await uploadList(formData).unwrap();

      showNotification({
        message: response.message || `File "${file.name}" uploaded successfully.`,
        type: "success"
      });

    } catch (error) {
      handleApiError(error, showNotification)
      console.error(error);
    } finally {
      // Clear the file input's value so the user can upload the same file again
      event.target.value = null;
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Upload Supplier List
      </Typography>

      <Paper sx={{ p: 4, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload CSV or Excel File
        </Typography>
        <Typography color="text.secondary" paragraph>
          Upload a file to import and process supplier data. You will be
          notified upon successful upload.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Upload File"}
            <input type="file" hidden accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
          </Button>
        </Box>

        {isLoading && <LinearProgress sx={{ mb: 2 }} />}
      </Paper>

      {/* --- REMOVED: Processed Data Table --- */}
      {/* --- REMOVED: Upload History Table --- */}
    </Box>
  )
}

export default SupplierListUpload