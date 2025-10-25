import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Grid, Autocomplete, TextField,
  List, ListItem, ListItemText, ListItemIcon, Checkbox, Divider,
  CircularProgress, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create'; // Or use PictureAsPdfIcon


import { useGetCustomQuotationDataQuery } from '../../store/api/quotationsApi';


function CreateQuotationPage() {
 const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null); // The selected product *name*
  const [suppliersForProduct, setSuppliersForProduct] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState(new Set());
  const [quotationItems, setQuotationItems] = useState([]);
  const [quotationHistory, setQuotationHistory] = useState([]);

  // --- Fetch ONLY the custom quotation data ---
  const {
    data: customQuotationData, // This holds the object { "Product Name": [...] }
    isLoading, // Renamed from isLoadingCustomData for simplicity
    isError,
    error,
  } = useGetCustomQuotationDataQuery();

  // --- NEW: Derive product names for the Autocomplete ---
  const productOptions = useMemo(() => {
    if (!customQuotationData) return [];
    // Get all keys (product names) from the fetched object
    return Object.keys(customQuotationData);
  }, [customQuotationData]);

  // --- MODIFIED: useEffect now filters the fetched data locally ---
  useEffect(() => {
    if (selectedProduct && customQuotationData) {
      // 1. Look up the product name in the fetched data object
      const productSuppliersData = customQuotationData[selectedProduct] || [];

      // 2. Map the results to the format your component expects
      const formattedSuppliers = productSuppliersData.map(item => ({
        supplierId: item.supplier,
        supplierName: item.supplier_name,
        price: parseFloat(item.retail_price || 0), // Or wholesale_price
        currency: item.currency || 'USD',
        // Get mobile if available in this data, otherwise remove or leave as N/A
        mobile: item.mobile || 'N/A', // Assuming mobile might be in the item details
      }));

      // Sort by price if needed
      formattedSuppliers.sort((a, b) => a.price - b.price);

      setSuppliersForProduct(formattedSuppliers);
      setSelectedSuppliers(new Set()); // Reset selections
    } else {
      setSuppliersForProduct([]);
      setSelectedSuppliers(new Set());
    }
    // Only depends on the selected product name and the fetched data
  }, [selectedProduct, customQuotationData]);

  // --- Handlers remain the same ---
    const handleSupplierSelect = (supplierId) => {

    setSelectedSuppliers(prev => {

      const newSet = new Set(prev);

      if (newSet.has(supplierId)) newSet.delete(supplierId);

      else newSet.add(supplierId);

      return newSet;

    });

  };
  const handleAddToQuotation = () => {
     if (!selectedProduct || selectedSuppliers.size === 0) return;

      const productDetails = customQuotationData[selectedProduct]?.[0]; // Get details from first entry
      if (!productDetails) return; // Should not happen if selectedProduct is valid

      const itemsToAdd = [];
      selectedSuppliers.forEach(supplierId => {
        const supplierInfo = suppliersForProduct.find(s => s.supplierId === supplierId);
        if (supplierInfo) {
          itemsToAdd.push({
            key: `${productDetails.id}-${supplierId}`, // Use actual product ID if available
            productId: productDetails.id, // Use actual product ID
            productName: selectedProduct, // The name is the key
            supplierId: supplierId,
            supplierName: supplierInfo.supplierName,
            price: supplierInfo.price,
            currency: supplierInfo.currency,
            unit: productDetails.unit, // Get unit from product details
          });
        }
      });
        setQuotationItems(prevItems => {
        const existingKeys = new Set(prevItems.map(item => item.key));
        const uniqueNewItems = itemsToAdd.filter(item => !existingKeys.has(item.key));
        return [...prevItems, ...uniqueNewItems];
    });
        setSelectedProduct(null); // Reset Autocomplete
    setSuppliersForProduct([]);
    setSelectedSuppliers(new Set());

  };
  const handleRemoveQuotationItem = (keyToRemove) => {

    setQuotationItems(prevItems => prevItems.filter(item => item.key !== keyToRemove));

  };
 const handleCreateQuotation = () => {

    console.log("Creating Quotation with items:", quotationItems);

    alert(`Quotation Created (in console) with ${quotationItems.length} items.`);

    // --- NEW: Clear the current quotation list ---

    setQuotationItems([]);



    // Optionally navigate away or reset other parts of the form

    setSelectedProduct(null);

    setSuppliersForProduct([]);

    setSelectedSuppliers(new Set());

    // Here you would eventually call your createQuotation API mutation

    // navigate('/quotations'); // Optionally navigate away

  };


  // --- Loading and Error Handling depends only on the single query ---
  if (isLoading) {
    return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
  }
  if (isError) {
    return <Alert severity="error">Error loading quotation data: {JSON.stringify(error)}</Alert>;
  }
  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/quotations")} sx={{ mb: 2 }}>
        Back to Quotations
      </Button>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Build New Quotation
      </Typography>

      {/* Section 1: Product Selection & Supplier Listing */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>1. Select Product</Typography>
        <Autocomplete
          id="product-quotation-select"
          options={productOptions} // Use derived product names
          getOptionLabel={(option) => option || ""} // Option is just the name string
          value={selectedProduct} // State now holds the name string
          onChange={(event, newValue) => setSelectedProduct(newValue)} // Set the name string
          renderInput={(params) => <TextField {...params} label="Search Product" />}
          sx={{ mb: 2 }}
        />

        {selectedProduct && (
          <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>Select Suppliers for "{selectedProduct}":</Typography>
            {suppliersForProduct.length > 0 ? (
              <List dense sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
                {suppliersForProduct.map((supplierInfo) => (
                  <ListItem key={supplierInfo.supplierId} disablePadding>
                     <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                       <Checkbox
                         edge="start"
                         checked={selectedSuppliers.has(supplierInfo.supplierId)}
                         onChange={() => handleSupplierSelect(supplierInfo.supplierId)}
                         size="small"
                       />
                     </ListItemIcon>
                     <ListItemText
                       primary={supplierInfo.supplierName}
                       secondary={`Mobile: ${supplierInfo.mobile || 'N/A'}`}
                     />
                     <Typography variant="body2" fontWeight="bold" sx={{ ml: 2 }}>
                       {`${supplierInfo.currency} ${supplierInfo.price}`}
                     </Typography>
                   </ListItem>
                ))}
              </List>
            ) : (
             <Typography color="text.secondary">No suppliers found offering this product.</Typography>
            )}
            <Button
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToQuotation}
              disabled={selectedSuppliers.size === 0}
              sx={{ mt: 2 }}
            >
              Add Selected Suppliers to Quotation
            </Button>
          </Box>
        )}
      </Paper>

      {/* Section 2: Current Quotation List */}
      <Paper sx={{ p: 3 }}>
  <Typography variant="h6" gutterBottom>2. Current Quotation Items</Typography>
  <TableContainer>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Product</TableCell>
          <TableCell>Supplier</TableCell>
          <TableCell align="right">Price</TableCell>
          <TableCell align="center">Remove</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {/* Check if the array is empty */}
        {quotationItems.length === 0 ? (
          <TableRow>
            {/* Cell spanning all columns */}
            <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
              <Typography color="text.secondary">No items added to the quotation yet.</Typography>
            </TableCell>
          </TableRow>
        ) : (
          // If not empty, map over the items
          quotationItems.map((item) => (
            <TableRow key={item.key}>
              <TableCell>{item.productName}</TableCell>
              <TableCell>{item.supplierName}</TableCell>
              <TableCell align="right">{`${item.currency} ${item.price}`}</TableCell>
              <TableCell align="center">
                <IconButton size="small" color="error" onClick={() => handleRemoveQuotationItem(item.key)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
    <Button
      variant="contained"
      color="primary"
      startIcon={<CreateIcon />}
      onClick={handleCreateQuotation}
      disabled={quotationItems.length === 0}
    >
      Create Quotation
    </Button>
  </Box>
</Paper>
    </Box>
  );
}

export default CreateQuotationPage;