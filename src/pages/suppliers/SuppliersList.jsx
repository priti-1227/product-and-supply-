"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  TablePagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Switch,
  Tooltip,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import SearchIcon from "@mui/icons-material/Search"
import { useGetSuppliersQuery, useDeleteSupplierMutation, useUploadSuppliersMutation } from "../../store/api/suppliersApi"
import { useNotification } from "../../hooks/useNotification"
import { handleApiError } from "../../utils/errorHandler"
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";



// Default data to seed localStorage if it's empty
const initialSuppliers = [
  { id: 1, uniqueId: "SUP-001", name: "Global Electronics", email: "contact@globalelectro.com", contactNo: "123-456-7890", status: "Active" },
  { id: 2, uniqueId: "SUP-002", name: "Innovate Tech", email: "info@innovatetech.io", contactNo: "987-654-3210", status: "Active" },
  { id: 3, uniqueId: "SUP-003", name: "Office Supplies Pro", email: "sales@officesupplies.pro", contactNo: "555-123-4567", status: "Inactive" },
];

const USE_DUMMY_DATA = false;
function SuppliersList() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [isActive, setIsActive] = useState(false);

const { data, isLoading, isError, error, refetch } = useGetSuppliersQuery({
  page: page + 1, // Add 1 because MUI's page is 0-indexed, but APIs are usually 1-indexed
  limit: rowsPerPage,
}); 


  // --- MODIFIED: Manage suppliers state with localStorage ---
  const [localSuppliers, setLocalSuppliers] = useState(() => {
    if (!USE_DUMMY_DATA) return [];
    try {
      const storedSuppliers = localStorage.getItem("dummySuppliers");
      // If data exists in localStorage, use it. Otherwise, seed it with initial data.
      if (storedSuppliers) {
        return JSON.parse(storedSuppliers);
      } else {
        localStorage.setItem("dummySuppliers", JSON.stringify(initialSuppliers));
        return initialSuppliers;
      }
    } catch (error) {
      console.error("Error with localStorage", error);
      return initialSuppliers;
    }
  });

  const [deleteSupplier, { isLoading: isDeleting }] = useDeleteSupplierMutation()
  const [uploadSuppliers, { isLoading: isUploading }] = useUploadSuppliersMutation()

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDeleteClick = (supplier) => {
    setSelectedSupplier(supplier)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    // REMOVE Y=THIS BLOCK IF NOT USING DUMMY DATA
     if (USE_DUMMY_DATA) {
      setLocalSuppliers(prev => prev.filter(s => s.id !== selectedSupplier.id));
      localStorage.setItem("dummySuppliers", JSON.stringify(localSuppliers.filter(s => s.id !== selectedSupplier.id)));
      setDeleteDialogOpen(false);
      setSelectedSupplier(null);
      // showNotification...
    }   else{  // ----T=TILL

    try {
      await deleteSupplier(selectedSupplier.id).unwrap()
      showNotification({
        message: "Supplier deleted successfully",
        type: "success",
      })
      setDeleteDialogOpen(false)
      setSelectedSupplier(null)
    } catch (err) {
      handleApiError(err, showNotification)
    }
  }}

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('suppliers', file); // Use the key 'suppliers'

      const response = await uploadSuppliers(formData).unwrap();

      // Show success toast with the message from the API
      showNotification({
        message: response.message || `File "${file.name}" uploaded successfully.`,
        type: "success"
      });
      
      refetch(); // Refetch the suppliers list

    } catch (error) {
        showNotification({
        message: error?.data?.message || "Failed to upload file",
        type: "error" // Set the type here
      });
      console.error(error);
    } finally {
      // Clear the file input's value
      event.target.value = null;
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

// UNCOMMENT FOR ERROR HANDLING 

  if (isError) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {handleApiError(error)}
        </Alert>
        <Button variant="contained" onClick={refetch}>
          Retry
        </Button>
      </Box>
    )
  }

  const suppliers = data?.data  || []
  console.log(suppliers, "test suppliers")
  // const suppliers = localSuppliers; for dummy
  const totalCount = data?.total || 0

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Suppliers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/suppliers/add")}
          sx={{ borderRadius: 2 }}
        >
          Create Supplier
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        {/* <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search suppliers by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{p:1}}
          />
        </Box> */}
        
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 2 ,gap:2}}>
             <Tooltip title="Upload Supplier Excel">
          <Button
  variant="outlined"
  component="label"
  size="small"
  disabled={isUploading}
  sx={{
    borderRadius: "50%",  // Use 50% for a perfect circle
    minWidth: 0,          // Remove default min-width
    width: 40,            // Set equal width
    height: 40,           // and height
    p: 0,                 // Remove padding to center the icon
  }}
>
  {isUploading ? <CircularProgress size={24} /> : <CloudUploadIcon />}
  <input type="file" hidden accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
  
</Button>
</Tooltip>
    <Tooltip title="Filter Suppliers">
      <IconButton
        onClick={() => setIsActive(!isActive)}
        sx={{
          backgroundColor: isActive ? "primary.main" : "primary.light",
          color: isActive ? "white" : "primary.main",
          border: isActive ? "0px solid" : "none",
          borderColor:  "primary.main" ,
          transition: "0.3s ease",
          "&:hover": {
            backgroundColor: isActive ? "primary.dark" : "primary.light",
          },
        }}
      >
        <FilterAltIcon />
      </IconButton>
    </Tooltip>

  </Box>

       <TableContainer sx={{ maxHeight: 400 }}>
  <Table stickyHeader aria-label="sticky table">
    <TableHead sx={{ letterSpacing: "0.05em" }}>
      <TableRow>
        <TableCell sx={{ fontWeight: 600, textAlign: "center", bgcolor: "primary.light" }}>ID</TableCell>
        <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Name</TableCell>
        <TableCell sx={{ fontWeight: 600, textAlign: "center", bgcolor: "primary.light" ,whiteSpace: "nowrap"}}>Contact Person</TableCell>
        <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Email</TableCell>
        <TableCell sx={{ fontWeight: 600, textAlign: "center", bgcolor: "primary.light" }}>Mobile</TableCell>
        <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Landline</TableCell>
        <TableCell sx={{ fontWeight: 600, textAlign: "center", bgcolor: "primary.light" }}>WhatsApp</TableCell>
        <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Viber</TableCell>
        <TableCell sx={{ fontWeight: 600, textAlign: "center", bgcolor: "primary.light" }}>Address</TableCell>
        <TableCell sx={{ fontWeight: 600, textAlign: "center" ,whiteSpace: "nowrap"}}>Created At</TableCell>
        <TableCell sx={{ fontWeight: 600, textAlign: "center", bgcolor: "primary.light" ,whiteSpace: "nowrap"}}>Updated At</TableCell>
        <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {suppliers.length === 0 ? (
        <TableRow>
          {/* Updated colSpan to match all 12 columns */}
          <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
            <Typography color="text.secondary">No suppliers found</Typography>
          </TableCell>
        </TableRow>
      ) : (
        suppliers.map((supplier) => (
          <TableRow key={supplier.id} hover>
            <TableCell align="center">{supplier.id}</TableCell>
            <TableCell>{supplier.name || "-"}</TableCell>
            <TableCell>{supplier.contact_person || "-"}</TableCell>
            <TableCell>{supplier.email || "-"}</TableCell>
            <TableCell align="center">{supplier.mobile || "-"}</TableCell>
            <TableCell align="center">{supplier.landline || "-"}</TableCell>
            <TableCell align="center">{supplier.whatsapp || "-"}</TableCell>
            <TableCell align="center">{supplier.viber || "-"}</TableCell>
            <TableCell>{supplier.address || "-"}</TableCell>
            <TableCell align="center">{new Date(supplier.created_at).toLocaleDateString()}</TableCell>
            <TableCell align="center">{new Date(supplier.updated_at).toLocaleDateString()}</TableCell>
            <TableCell align="center" >
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
              
              <IconButton
                size="small"
                color="primary"
                onClick={() => navigate(`/suppliers/edit/${supplier.id}`)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteClick(supplier)}
                disabled={isDeleting}
              >
                <DeleteIcon />
              </IconButton>
              </Box>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete supplier "{selectedSupplier?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SuppliersList
