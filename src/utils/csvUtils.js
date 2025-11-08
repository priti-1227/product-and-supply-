// src/utils/csvUtils.js

// This function safely formats a single cell for CSV
const formatCsvCell = (data) => {
  let cell = String(data || "").trim(); // Handle null/undefined
  // If the cell contains a comma, double quotes, or newline, wrap it in double quotes
  if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
    // Escape existing double quotes by doubling them
    cell = `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
};

// This function generates the CSV from your quote data
export const generateQuotationCSV = (quote) => {
  if (!quote || !quote.items || quote.items.length === 0) {
    alert("Cannot generate CSV: Invalid quotation data.");
    return;
  }

  // 1. Define Headers
  const headers = ["Product", "Supplier", "Quantity", "Unit Price", "Total Price"];
  let csvContent = headers.join(",") + "\n"; // Create the header row

  let grandTotal = 0;
  const currencySymbol = quote.currency || '$';

  // 2. Add Item Rows
  quote.items.forEach(item => {
    const unitPrice = parseFloat(item.unit_price || 0);
    const quantity = item.quantity || 1;
    const totalPrice = parseFloat(item.total_price || 0) > 0 ? parseFloat(item.total_price) : unitPrice * quantity;
    grandTotal += totalPrice;

    const row = [
      item.product_name || 'N/A',
      quote.supplier_name || 'N/A',
      quantity,
      unitPrice.toFixed(2),
      totalPrice.toFixed(2)
    ];

    csvContent += row.map(formatCsvCell).join(",") + "\n"; // Add the formatted row
  });

  // 3. Add Total Row
  csvContent += "\n"; // Add a blank line
  csvContent += `,,,Total Amount,${parseFloat(quote.total_amount || grandTotal).toFixed(2)}\n`;
  csvContent += `,,,Currency,${currencySymbol}\n`;

  // 4. Create and Download the File
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  
  const fileName = `Quotation_${quote.id}_${(quote.supplier_name || 'Quote').replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
  link.setAttribute("download", fileName);
  
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};