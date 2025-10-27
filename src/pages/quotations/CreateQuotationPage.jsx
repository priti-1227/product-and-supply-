import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Grid, Autocomplete, TextField,
  List, ListItem, ListItemText, ListItemIcon, Checkbox, Divider,
  CircularProgress, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip // Added Tooltip back
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import EditIcon from '@mui/icons-material/Edit'; // Keep if used elsewhere

// Import hooks
import {
  useGetSupplierWiseProductsQuery,
  useCreateQuotationMutation // <-- Import the create mutation hook
} from '../../store/api/quotationsApi'; // Make sure path is correct
import { useNotification } from '../../hooks/useNotification'; // <-- For success/error messages
import { handleApiError } from '../../utils/errorHandler'; // <-- For error handling

// --- REMOVED: localStorage key ---

function CreateQuotationPage() {
  const navigate = useNavigate();
  const [selectedSupplierName, setSelectedSupplierName] = useState(null);
  const [productsForSupplier, setProductsForSupplier] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [quotationItems, setQuotationItems] = useState([]);
  // --- REMOVED: quotationHistory state ---

  // --- API Hooks ---
  const {
    data: supplierWiseData,
    isLoading,
    isError,
    error,
  } = useGetSupplierWiseProductsQuery();

  // Use the mutation hook
  const [createQuotation, { isLoading: isCreatingQuotation }] = useCreateQuotationMutation();
  const { showNotification } = useNotification(); // Destructure showNotification

  // Derive supplier names for the dropdown
  const supplierOptions = useMemo(() => {
    if (!supplierWiseData) return [];
    return Object.keys(supplierWiseData);
  }, [supplierWiseData]);

  // Update product list when supplier name changes
  useEffect(() => {
    if (selectedSupplierName && supplierWiseData) {
      const products = supplierWiseData[selectedSupplierName] || [];
      setProductsForSupplier(products);
      setSelectedProducts(new Set());
    } else {
      setProductsForSupplier([]);
    }
  }, [selectedSupplierName, supplierWiseData]);

  // --- REMOVED: useEffect for loading history ---

  // --- Handlers ---
  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) newSet.delete(productId);
      else newSet.add(productId);
      return newSet;
    });
  };

  const handleAddToQuotation = () => {
    if (!selectedSupplierName || selectedProducts.size === 0) return;
    const productDetails = supplierWiseData[selectedSupplierName]?.[0]; // Get details from first entry
    if (!productDetails) return;

    const itemsToAdd = [];
    selectedProducts.forEach(productId => {
      const productInfo = productsForSupplier.find(p => p.id === productId);
      if (productInfo) {
        itemsToAdd.push({
          key: `${productId}-${productInfo.supplier}`,
          productId: productId,
          productName: productInfo.name,
          supplierId: productInfo.supplier,
          supplierName: selectedSupplierName,
          price: parseFloat(productInfo.retail_price || 0).toFixed(2), // Format price here
          currency: productInfo.currency || 'USD',
          unit: productInfo.unit,
        });
      }
    });

    setQuotationItems(prevItems => {
      const existingKeys = new Set(prevItems.map(item => item.key));
      const uniqueNewItems = itemsToAdd.filter(item => !existingKeys.has(item.key));
      return [...prevItems, ...uniqueNewItems];
    });

    setSelectedSupplierName(null);
    setProductsForSupplier([]);
    setSelectedProducts(new Set());
  };

  const handleRemoveQuotationItem = (keyToRemove) => {
    setQuotationItems(prevItems => prevItems.filter(item => item.key !== keyToRemove));
  };

  // --- MODIFIED: Create Quotation handler with API call ---
  const handleCreateQuotation = async () => {
    if (quotationItems.length === 0) return;

    // 1. Group items by supplier_id
    const itemsBySupplier = quotationItems.reduce((acc, item) => {
      if (!acc[item.supplierId]) {
        acc[item.supplierId] = { supplier_id: item.supplierId, total_amount: 0, items: [] };
      }
      const itemPayload = {
        product_id: item.productId,
        unit_price: String(item.price), // Ensure unit_price is a string
        total_amount: String(item.price), // Assuming quantity is 1, ensure string
      };
      acc[item.supplierId].items.push(itemPayload);
      acc[item.supplierId].total_amount += parseFloat(item.price);
      return acc;
    }, {});

    // 2. Create an array of API call promises
    const creationPromises = Object.values(itemsBySupplier).map(payload =>
      createQuotation({
        ...payload,
        total_amount: payload.total_amount.toFixed(2) // Format total_amount
      }).unwrap() // Use unwrap for easier error handling
    );

    try {
      // 3. Execute all API calls concurrently
      const results = await Promise.all(creationPromises);

      showNotification({
        message: `Successfully created ${results.length} quotation(s).`,
        type: "success",
      });

      // 4. Clear the current quotation list and selections on success
      setQuotationItems([]);
      setSelectedSupplierName(null);
      setProductsForSupplier([]);
      setSelectedProducts(new Set());

    } catch (err) {
      console.error("Failed to create one or more quotations:", err);
      // Use your specific error handler
      handleApiError(err, showNotification);
    }
  };

  // --- Loading and Error Handling ---
  if (isLoading) {
    return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
  }
  if (isError) {
    return <Alert severity="error">Error loading data: {JSON.stringify(error)}</Alert>;
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/quotations")} sx={{ mb: 2 }}>
        Back to Quotations
      </Button>
      <Typography variant="h4" fontWeight={600} mb={3}>
       Create Quotation
      </Typography>

      {/* Section 1: Supplier Selection & Product Listing */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>1. Select Supplier</Typography>
        <Autocomplete
          id="supplier-quotation-select"
          options={supplierOptions}
          getOptionLabel={(option) => option || ""}
          value={selectedSupplierName}
          onChange={(event, newValue) => setSelectedSupplierName(newValue)}
          renderInput={(params) => <TextField {...params} label="Search Supplier" placeholder="Choose a supplier..." />}
          sx={{ mb: 2 }}
        />

        {selectedSupplierName && (
          <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>Select Products from "{selectedSupplierName}":</Typography>
            {/* Product List */}
            {productsForSupplier.length > 0 ? (
              <List dense sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
                {productsForSupplier.map((productInfo) => (
                  <ListItem key={productInfo.id} disablePadding>
                    <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                      <Checkbox
                        edge="start"
                        checked={selectedProducts.has(productInfo.id)}
                        onChange={() => handleProductSelect(productInfo.id)}
                        size="small"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={productInfo.name}
                      secondary={`Unit: ${productInfo.unit || 'N/A'}`}
                    />
                    <Typography variant="body2" fontWeight="bold" sx={{ ml: 2 }}>
                      {`${productInfo.currency || 'USD'} ${parseFloat(productInfo.retail_price || 0).toFixed(2)}`}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No products found for this supplier.</Typography>
            )}
            {/* Add Button */}
            <Button
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToQuotation}
              disabled={selectedProducts.size === 0}
              sx={{ mt: 2 }}
            >
              Add Selected Products to Quotation
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
              {quotationItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">No items added yet.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
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
        {/* Create Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={isCreatingQuotation ? <CircularProgress size={20} color="inherit"/> : <CreateIcon />}
            onClick={handleCreateQuotation}
            disabled={quotationItems.length === 0 || isCreatingQuotation}
          >
            {isCreatingQuotation ? 'Creating...' : 'Create Quotation(s)'}
          </Button>
        </Box>
      </Paper>

      {/* --- REMOVED: Section 3: Quotation History --- */}
    </Box>
  );
}

export default CreateQuotationPage;