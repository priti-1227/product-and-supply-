// src/utils/excelUtils.js
import * as XLSX from 'xlsx';

export const generateQuotationExcel = (quote) => {
  if (!quote || !quote.items || !quote.items.length === 0) {
    console.error("Invalid quotation data provided for Excel generation.");
    alert("Cannot generate Excel: Invalid quotation data.");
    return;
  }

  // --- 1. Prepare Data ---
  const quoteId = quote.id || `TEMP-${Date.now().toString().slice(-6)}`;
  const quoteDate = quote.created_at ? new Date(quote.created_at).toLocaleDateString() : new Date().toLocaleDateString();
  const validUntilDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(); // 30 days validity
  const currencySymbol = quote.currency || '$';
  let subtotal = 0;

  // --- 2. Build Worksheet Data (Array of Arrays) ---
  const wsData = [
    // Section 1: Header
    // Row 1: Company Name (will merge A1:C1), Address (will merge D1:E1)
    ["Supply Nd Product", "", "", "123 Business Street"],
    // Row 2: Title (will merge A2:C2), City/State
    ["QUOTATION", "", "", "Ahemdabad, 363310"],
    // Row 3: Phone, Email
    ["Phone: +91 9876543234", "", "", "Email: supplynproduct@gmail.com"],
    [], // Blank row

    // Section 2: Meta Info
    // Row 5: Quote #
    ["QUOTE #:", quoteId],
    // Row 6: Date Issued
    ["DATE ISSUED:", quoteDate],
    // Row 7: Supplier
    ["SUPPLIER:", quote.supplier_name || 'N/A'],
    // Row 8: Valid Until
    ["VALID UNTIL:", validUntilDate],
    [], // Blank row
    
    // Section 3: Items Table
    // Row 10: Table Header
    ["#", "PRODUCT NAME", "QTY", "UNIT PRICE", "TOTAL AMOUNT"]
  ];

  // --- 3. Add Item Rows to wsData ---
  quote.items.forEach((item, index) => {
    const unitPrice = parseFloat(item.unit_price || 0);
    const quantity = item.quantity || 1;
    const totalPrice = parseFloat(item.total_price || 0) > 0 ? parseFloat(item.total_price) : unitPrice * quantity;
    subtotal += totalPrice;

    wsData.push([
      index + 1,
      item.product_name || 'N/A',
      quantity,
      // Format as a number in Excel
      { v: unitPrice, t: 'n', z: `"${currencySymbol}"#,##0.00` },
      { v: totalPrice, t: 'n', z: `"${currencySymbol}"#,##0.00` }
    ]);
  });

  // --- 4. Add Totals ---
  const grandTotal = parseFloat(quote.total_amount || subtotal);
  wsData.push([]); // Blank row
  wsData.push(["", "", "", "SUBTOTAL", { v: subtotal, t: 'n', z: `"${currencySymbol}"#,##0.00` }]);
  wsData.push(["", "", "", "TOTAL QUOTE", { v: grandTotal, t: 'n', z: `"${currencySymbol}"#,##0.00` }]);
  
  // --- 5. Create Worksheet and Workbook ---
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // --- 6. Add Merges and Styling ---
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // Merge A1:C1 for "Supply Nd Product"
    { s: { r: 0, c: 3 }, e: { r: 0, c: 4 } }, // Merge D1:E1 for Address
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }, // Merge A2:C2 for "QUOTATION"
    { s: { r: 1, c: 3 }, e: { r: 1, c: 4 } }, // Merge D2:E2
    { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } }, // Merge A3:C3
    { s: { r: 2, c: 3 }, e: { r: 2, c: 4 } }, // Merge D3:E3
    
    { s: { r: 4, c: 1 }, e: { r: 4, c: 2 } }, // Merge B5:C5 for Quote ID value
    { s: { r: 5, c: 1 }, e: { r: 5, c: 2 } }, // Merge B6:C6 for Date value
    { s: { r: 6, c: 1 }, e: { r: 6, c: 2 } }, // Merge B7:C7 for Supplier value
    { s: { r: 7, c: 1 }, e: { r: 7, c: 2 } }, // Merge B8:C8 for Valid Until value
  ];

  // Set Column Widths (in characters)
  ws['!cols'] = [
    { wch: 5 },  // A (#)
    { wch: 45 }, // B (Product Name)
    { wch: 10 }, // C (Qty)
    { wch: 15 }, // D (Unit Price)
    { wch: 15 }  // E (Total Amount)
  ];

  // --- 7. Generate and Download File ---
  XLSX.utils.book_append_sheet(wb, ws, "Quotation"); // "Quotation" is the sheet name
  
  const fileName = `Quotation_${quoteId}_${(quote.supplier_name || 'Quote').replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
  XLSX.writeFile(wb, fileName);
};