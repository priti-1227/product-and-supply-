import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Grid, Autocomplete, TextField,
  List, ListItem, ListItemText, ListItemIcon, Checkbox, Divider,
  CircularProgress, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import EditIcon from '@mui/icons-material/Edit'; // Keep if used elsewhere

// Import hooks
import {
  useGetSupplierWiseProductsQuery,
  useCreateQuotationMutation
} from '../../store/api/quotationsApi';
import { useNotification } from '../../hooks/useNotification';
import { handleApiError } from '../../utils/errorHandler';
import { generateQuotationPDF } from '../../utils/pdfUtils';

function CreateQuotationPage() {
  const navigate = useNavigate();
  const [selectedSupplierName, setSelectedSupplierName] = useState(null);
  const [productsForSupplier, setProductsForSupplier] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [quotationItems, setQuotationItems] = useState([]);
  // --- NEW: State to track the supplier ID for the current quotation ---
  const [currentQuotationSupplierId, setCurrentQuotationSupplierId] = useState(null);

  // --- API Hooks ---
  const {
    data: supplierWiseData,
    isLoading,
    isError,
    error,
  } = useGetSupplierWiseProductsQuery();
  const [createQuotation, { isLoading: isCreatingQuotation }] = useCreateQuotationMutation();
  const { showNotification } = useNotification();

  // Derive supplier names for the dropdown
  const supplierOptions = useMemo(() => {
    if (!supplierWiseData) return [];
    return Object.keys(supplierWiseData);
  }, [supplierWiseData]);

  // Update product list when supplier name changes (logic remains same)
  useEffect(() => {
    if (selectedSupplierName && supplierWiseData) {
      const products = supplierWiseData[selectedSupplierName] || [];
      setProductsForSupplier(products);
      setSelectedProducts(new Set()); // Reset product selections for the new supplier
    } else {
      setProductsForSupplier([]);
    }
  }, [selectedSupplierName, supplierWiseData]);

  // --- Handlers ---
  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) newSet.delete(productId);
      else newSet.add(productId);
      return newSet;
    });
  };

  // --- MODIFIED: Add to Quotation Handler ---
  const handleAddToQuotation = () => {
    if (!selectedSupplierName || selectedProducts.size === 0) return;

    // Determine the supplier ID from the first selected product
    const firstProductId = selectedProducts.values().next().value;
    const firstProductInfo = productsForSupplier.find(p => p.id === firstProductId);
    if (!firstProductInfo) return; // Should not happen

    const supplierIdToAdd = firstProductInfo.supplier;

    // Check if we are starting a new quote or adding to an existing one
    if (quotationItems.length === 0) {
      // Starting a new quote, set the current supplier ID
      setCurrentQuotationSupplierId(supplierIdToAdd);
    } else if (supplierIdToAdd !== currentQuotationSupplierId) {
      // Safeguard: Prevent adding items from different suppliers
      // This should be caught earlier by the Autocomplete check
      alert("Error: You can only add items from the currently selected supplier for this quotation.");
      return;
    }

    const itemsToAdd = [];
    selectedProducts.forEach(productId => {
      const productInfo = productsForSupplier.find(p => p.id === productId);
      if (productInfo) {
        itemsToAdd.push({
          key: `${productId}-${supplierIdToAdd}`, // Unique key
          productId: productId,
          productName: productInfo.name,
          supplierId: supplierIdToAdd, // Use consistent supplier ID
          supplierName: selectedSupplierName,
          price: parseFloat(productInfo.retail_price || 0).toFixed(2),
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

    // Clear selected products, but KEEP the supplier selected
    setSelectedProducts(new Set());
    // Do NOT reset selectedSupplierName here
  };

  const handleRemoveQuotationItem = (keyToRemove) => {
    setQuotationItems(prevItems => {
        const remainingItems = prevItems.filter(item => item.key !== keyToRemove);
        // If list becomes empty, reset the current supplier ID tracker
        if (remainingItems.length === 0) {
            setCurrentQuotationSupplierId(null);
        }
        return remainingItems;
    });
  };

  // --- MODIFIED: Create Quotation handler (simplified) ---
  const handleCreateQuotation = async () => {
    if (quotationItems.length === 0 || currentQuotationSupplierId === null) {
        showNotification({ message: "No items added or supplier not set.", type: "warning" });
        return;
    };

    // 1. Prepare the single payload
    const payload = {
      supplier_id: currentQuotationSupplierId,
      total_amount: quotationItems.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2),
      items: quotationItems.map(item => ({
        product_id: item.productId,
        unit_price: String(item.price), // Ensure string format if API requires
        total_amount: String(item.price), // Assuming quantity 1, ensure string
      })),
      // Add other top-level fields if your API expects them (e.g., title, notes)
      title: `Quotation for ${quotationItems[0]?.supplierName || 'Supplier'}`,
      notes: "", // Add a notes field if needed
      currency: quotationItems[0]?.currency || 'USD', // Get currency from first item
    };

    try {
      // 2. Make the single API call
      const result = await createQuotation(payload).unwrap();

      showNotification({
        message: `Successfully created quotation ID ${result?.id || payload.supplier_id}.`, // Use ID from response if available
        type: "success",
      });
      // --- 3. Generate PDF using the data we have ---
      // Construct the 'quote' object needed by generateQuotationPDF
      const quoteDataForPDF = {
        id: result?.id || payload.supplier_id, // Use ID from API response if available
        supplier_name: quotationItems[0]?.supplierName || 'N/A',
        created_at: result?.created_at || new Date().toISOString(), // Use API response or now
        items: quotationItems.map(item => ({ // Map items to match PDF function's expectation
            product_name: item.productName,
            quantity: item.quantity || 1, // Assuming quantity 1 if not stored
            unit_price: item.price,
            total_price: item.price // Assuming quantity 1
        })),
        total_amount: payload.total_amount,
        currency: payload.currency,
        title: payload.title,
        notes: payload.notes,
      };

      try {
        generateQuotationPDF(quoteDataForPDF); // Call the imported PDF function
      } catch (pdfError) {
        console.error("PDF Generation Error:", pdfError);
        showNotification({ message: "Quotation created but failed to generate PDF.", type: "warning" });
      }
      // --- End PDF Generation ---

      // 3. Clear everything on success
      setQuotationItems([]);
      setSelectedSupplierName(null);
      setProductsForSupplier([]);
      setSelectedProducts(new Set());
      setCurrentQuotationSupplierId(null); // Reset tracked supplier

    } catch (err) {
      console.error("Failed to create quotation:", err);
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
          onChange={(event, newValue) => {
            // --- MODIFIED: Autocomplete onChange logic ---
            const newSupplierId = supplierWiseData && newValue
              ? supplierWiseData[newValue]?.[0]?.supplier
              : null;

            // Check only if items exist AND the *actual ID* is changing
            if (quotationItems.length > 0 && newSupplierId !== currentQuotationSupplierId && newSupplierId !== null) {
              
                setQuotationItems([]);
                setCurrentQuotationSupplierId(newSupplierId);
                setSelectedSupplierName(newValue); // Update the name state
              
            } else {
              // No conflict or clearing existing items: Just update the selected supplier
              setCurrentQuotationSupplierId(newSupplierId);
              setSelectedSupplierName(newValue);
            }
            // --- END MODIFIED LOGIC ---
          }}
          renderInput={(params) => <TextField {...params} label="" placeholder="Choose a supplier..." />}
          sx={{ mb: 2 }}
        />

        {/* Product List - Renders based on selectedSupplierName */}
        {selectedSupplierName && (
          <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>Select Products from "{selectedSupplierName}":</Typography>
            {/* Loading/Error specifically for products can be added here if using a separate hook */}
          {productsForSupplier.length > 0 ? (
  <List dense sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
    {productsForSupplier.map((productInfo) => (
      <ListItem key={productInfo.id} disablePadding sx={{ alignItems: 'flex-start' }}> {/* Align items top */}
        <ListItemIcon sx={{ minWidth: 0, mr: 1, mt: 0.5 }}> {/* Adjust icon margin top */}
          <Checkbox
            edge="start"
            checked={selectedProducts.has(productInfo.id)}
            onChange={() => handleProductSelect(productInfo.id)}
            size="small"
          />
        </ListItemIcon>
        {/* Updated ListItemText */}
        <ListItemText
          primary={productInfo.name}
          secondary={
            <React.Fragment>
              <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block' }}>
                {`Unit: ${productInfo.unit || 'N/A'}`}
              </Typography>
              <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {`Packing: ${productInfo.packing || 'N/A'}  Origin: ${productInfo.country_of_origin || 'N/A'}`}
              </Typography>
              {/* <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {`Origin: ${productInfo.country_of_origin || 'N/A'}`}
              </Typography> */}
            </React.Fragment>
          }
        />
        {/* Price remains on the right */}
        <Typography variant="body2" fontWeight="bold" sx={{ ml: 2, mt: 0.5 }}> {/* Adjust margin top */}
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
              Add Selected Products
            </Button>
          </Box>
        )}
      </Paper>

      {/* Section 2: Current Quotation List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          2. Quotation Items 
        </Typography>
        <TableContainer>
          {/* ... Table remains the same ... */}
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
            {isCreatingQuotation ? 'Creating...' : 'Create Quotation'} {/* Updated text */}
          </Button>
        </Box>
      </Paper>

    </Box>
  );
}

export default CreateQuotationPage;