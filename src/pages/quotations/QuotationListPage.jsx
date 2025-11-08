import React from 'react'; // Removed useState as pagination state is gone
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, CircularProgress,
  Alert, Tooltip // Added Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit'; // Remove if not used
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useGetQuotationsQuery } from '../../store/api/quotationsApi';
import { generateQuotationPDF } from '../../utils/pdfUtils';
import DownloadIcon from '@mui/icons-material/Download';
function QuotationListPage() {
  const navigate = useNavigate();
  const {
    data, // Contains { data: results[], total: count } after transformResponse
    isLoading,
    isError,
    error,
    refetch
  } = useGetQuotationsQuery(); // <-- Call without arguments
console.log(data,"test data")
  // data.data is the array from transformResponse
  const quotations = data?.data || [];
  // data.total is the length from transformResponse
  const totalCount = data?.total || 0;
 if (isLoading) {
    return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
  }

  if (isError) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading quotations: {JSON.stringify(error)}
        </Alert>
        <Button variant="contained" onClick={refetch}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Quotations ({totalCount}) {/* Optionally show count */}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/quotations/create')}
          sx={{ borderRadius: 2 }}
        >
          Create New Quotation
        </Button>
      </Box>

      {/* Quotation List Table */}
      <Paper sx={{ p: 3 }}>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead sx={{ letterSpacing: "0.05em" }}>
              <TableRow>
                {/* Adjust headers based on actual quotation data */}
                <TableCell sx={{ fontWeight: 600, textAlign: "center", bgcolor: "primary.light", whiteSpace: "nowrap" }}>Quotation ID</TableCell>
                <TableCell sx={{ fontWeight: 600 ,textAlign: "center", whiteSpace: "nowrap"}}  align="center">Date Created</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center", bgcolor: "primary.light", whiteSpace: "nowrap" }}>Supplier</TableCell>
                <TableCell sx={{ fontWeight: 600 ,textAlign: "center", whiteSpace: "nowrap"}}  align="center">Item Count</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center", bgcolor: "primary.light", whiteSpace: "nowrap" }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 ,textAlign: "center", whiteSpace: "nowrap"}} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No quotations found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                quotations.map((quote) => (
                  <TableRow key={quote.id} hover>
                    {/* Adjust cell content based on actual quotation data fields */}
                    <TableCell>{quote.id || 'N/A'}</TableCell>
                    <TableCell>{quote.created_at ? new Date(quote.created_at).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>{quote.supplier_name || 'N/A'}</TableCell>
                    <TableCell align="center">{quote.items?.length || 0}</TableCell> {/* Count items */}
                    <TableCell align="center">{quote.total_amount ? `${quote.currency || '$'} ${parseFloat(quote.total_amount).toFixed(2)}` : 'N/A'}</TableCell>
                    <TableCell align="center">
                        <Tooltip title="Download PDF">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => generateQuotationPDF(quote)}
                          disabled={!quote.items || quote.items.length === 0}
                        >
                          <DownloadIcon fontSize="medium"/>
                        </IconButton>
                      </Tooltip>
                      {/* <Tooltip title="View Details" sx={{ml:1}}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            // Simple view, replace with navigation or modal later
                            alert(`Quotation ${quote.id} Items:\n${(quote.items || []).map(i => `${i.product_name} - ${i.unit_price}`).join('\n')}`);
                            console.log(quote);
                          }}
                        >
                            <VisibilityIcon fontSize="small"/>
                        </IconButton>
                      </Tooltip> */}
                  
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

       
      </Paper>
    </Box>
  );
}

export default QuotationListPage;