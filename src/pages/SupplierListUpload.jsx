"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  LinearProgress,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DownloadIcon from "@mui/icons-material/Download"

import { useNotification } from "../hooks/useNotification"
import { useGetSupplierListsQuery, useUploadSupplierListMutation } from "../store/api/supplierListApi"

function SupplierListUpload() {
  const [uploadedData, setUploadedData] = useState([])
  const { showSuccess, showError } = useNotification()

  const { data: listsData, isLoading: isLoadingLists } = useGetSupplierListsQuery({ page: 1, limit: 10 })
  const [uploadList, { isLoading: isUploading }] = useUploadSupplierListMutation()

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        // In a real app, you'd parse the file and extract data
        // For now, we'll simulate with mock data
        const mockParsedData = [
          { name: "New Supplier A", email: "contact@newsuppliera.com", contactNo: "+1-555-0001" },
          { name: "New Supplier B", email: "info@newsupplierb.com", contactNo: "+1-555-0002" },
        ]

        await uploadList({
          fileName: file.name,
          uploadedBy: "Current User",
          totalRecords: mockParsedData.length,
          processedRecords: mockParsedData.length,
          failedRecords: 0,
        }).unwrap()

        setUploadedData(mockParsedData)
        showSuccess(`Successfully uploaded ${mockParsedData.length} suppliers`)
      } catch (error) {
        showError(error?.data?.message || "Failed to upload file")
      }
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
          Upload a file containing supplier information. The file should include columns for Supplier ID, Name, Email,
          Contact Number, and Status.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload File"}
            <input type="file" hidden accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Download Template
          </Button>
        </Box>

        {isUploading && <LinearProgress sx={{ mb: 2 }} />}

        {uploadedData.length > 0 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Successfully uploaded {uploadedData.length} suppliers
          </Alert>
        )}
      </Paper>

      {uploadedData.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Preview Uploaded Data
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.contactNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained">Confirm Import</Button>
          </Box>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload History
        </Typography>
        {isLoadingLists ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>File Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Uploaded By</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Records</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listsData?.data?.map((list) => (
                  <TableRow key={list.id}>
                    <TableCell>{list.fileName}</TableCell>
                    <TableCell>{list.uploadedBy}</TableCell>
                    <TableCell>{new Date(list.uploadedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{list.totalRecords}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          display: "inline-block",
                          bgcolor: list.status === "completed" ? "success.light" : "warning.light",
                          color: list.status === "completed" ? "success.dark" : "warning.dark",
                        }}
                      >
                        {list.status}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  )
}

export default SupplierListUpload
