import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Function accepts the specific quotation object
export const generateQuotationPDF = (quote) => {
  if (!quote || !quote.items || quote.items.length === 0) {
    console.error("Invalid quotation data provided for PDF generation.");
    alert("Cannot generate PDF: Invalid quotation data.");
    return;
  }

  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const margin = 15; // Increased margin slightly
  const contentWidth = pageWidth - 2 * margin;
  let currentY = margin;

  // --- 1. Header Section ---
  const headerCol1X = margin;
  const headerCol2X = pageWidth / 2 + 10; // Start of right column
  const headerCol2Width = pageWidth - headerCol2X - margin;

  // Company Info (Top Left)
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0); // Black text
  doc.text("Supply Nd Product", headerCol1X, currentY); // Replace Placeholder
  currentY += 5;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(80); // Dark Gray
  doc.text("Gota", headerCol1X, currentY); currentY += 4; // Replace Placeholder
  doc.text("Ahemdabad , 363310", headerCol1X, currentY); currentY += 4; // Replace Placeholder
  doc.text("Phone: +91 9876543234", headerCol1X, currentY); currentY += 4; // Replace Placeholder
  doc.text("Fax: Test@fax", headerCol1X, currentY); currentY += 4; // Replace Placeholder
  doc.text("E-mail: supplynproduct@gmail.com", headerCol1X, currentY); // Replace Placeholder

  // "QUOTATION" Title (Top Right)
  const titleY = margin; // Align title with top
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0);
  doc.text("QUOTATION", pageWidth - margin, titleY + 5, { align: 'right' }); // Position from right

  // Quote Meta Table (Top Right, below title)
  const metaTableY = titleY + 12;
  const quoteId = quote.id || `TEMP-${Date.now().toString().slice(-6)}`;
  const quoteDate = quote.created_at ? new Date(quote.created_at).toLocaleDateString() : new Date().toLocaleDateString();
  const validUntilDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(); // Example: 30 days validity

  autoTable(doc, {
    body: [
      [{ content: 'QUOTE #', styles: { fontStyle: 'bold', halign: 'left', fillColor: [230, 230, 230] } }, { content: quoteId, styles: { halign: 'right' } }],
      [{ content: 'DATE', styles: { fontStyle: 'bold', halign: 'left', fillColor: [230, 230, 230] } }, { content: quoteDate, styles: { halign: 'right' } }],
      [{ content: 'SUPPLIER ID', styles: { fontStyle: 'bold', halign: 'left', fillColor: [230, 230, 230] } }, { content: quote.supplier || 'N/A', styles: { halign: 'right' } }], // Using Supplier ID
      [{ content: 'VALID UNTIL', styles: { fontStyle: 'bold', halign: 'left', fillColor: [230, 230, 230] } }, { content: validUntilDate, styles: { halign: 'right' } }],
    ],
    startY: metaTableY,
    theme: 'grid',
    tableWidth: headerCol2Width, // Fit in the right column
    margin: { left: headerCol2X }, // Position in the right column
    styles: { fontSize: 8, cellPadding: 1.5, lineColor: [180, 180, 180], lineWidth: 0.1 },
    columnStyles: { 0: { cellWidth: headerCol2Width * 0.4 }, 1: { cellWidth: headerCol2Width * 0.6 } }
  });

  // Ensure currentY is below both header columns
  currentY = Math.max(currentY, (doc).lastAutoTable.finalY) + 10;

  // --- 2. Customer Info & Prepared By ---

  // Customer/Supplier Info Box (Mid Left)
  doc.setFillColor(230, 230, 230); // Light gray background
  doc.rect(margin, currentY, (pageWidth / 2) - margin - 5, 5, 'F'); // Background rect for title
  doc.setFontSize(8); doc.setFont(undefined, 'bold'); doc.setTextColor(0);
  doc.text("CUSTOMER INFO", margin + 2, currentY + 3.5);
  currentY += 8; // Move below title bar

  doc.setFontSize(9); doc.setFont(undefined, 'normal'); doc.setTextColor(80);
  doc.text(quote.supplier_name || '[Supplier Name]', margin, currentY); currentY += 4;
  // Fetch and add supplier address, phone, email if available/needed
  // doc.text("[Supplier Street Address]", margin, currentY); currentY += 4;
  // doc.text("[City, ST ZIP]", margin, currentY); currentY += 4;
  // doc.text(`Phone: ${supplierDetails?.mobile || 'N/A'}`, margin, currentY); currentY+=4; // Example
  // doc.text(`Email: ${supplierDetails?.email || 'N/A'}`, margin, currentY); // Example

  // Prepared By (Placeholder)
  doc.setFontSize(9); doc.setFont(undefined, 'normal'); doc.setTextColor(100);
  doc.text("Prepared By: Samyak Sanghavi", headerCol2X, currentY); // Adjust Y if needed

  currentY += 15; // Space before next section

  // --- 3. Description of Work (Optional - using notes field) ---
  if (quote.notes) {
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, currentY, contentWidth, 5, 'F');
    doc.setFontSize(8); doc.setFont(undefined, 'bold'); doc.setTextColor(0);
    doc.text("DESCRIPTION / NOTES", margin + 2, currentY + 3.5);
    currentY += 8;
    doc.setFontSize(9); doc.setFont(undefined, 'normal'); doc.setTextColor(80);
    // Use splitTextToSize for auto-wrapping
    const splitNotes = doc.splitTextToSize(quote.notes, contentWidth - 4); // Subtract padding
    doc.text(splitNotes, margin + 2, currentY);
    currentY += splitNotes.length * 4 + 5; // Adjust Y based on lines
  }

  // --- 4. Itemized Costs Table ---
  doc.setFillColor(230, 230, 230);
  doc.rect(margin, currentY, contentWidth, 5, 'F');
  doc.setFontSize(8); doc.setFont(undefined, 'bold'); doc.setTextColor(0);
  doc.text("ITEMIZED COSTS", margin + 2, currentY + 3.5);
  currentY += 5; // Move Y down just below the title bar

  const tableColumn = ["DESCRIPTION", "QTY", "UNIT PRICE", "AMOUNT"];
  const tableRows = [];
  const currencySymbol = quote.currency || '$';
  let subtotal = 0;

  quote.items.forEach((item) => {
    const unitPrice = parseFloat(item.unit_price || 0);
    const quantity = item.quantity || 1;
    const totalPrice = parseFloat(item.total_price || 0) > 0 ? parseFloat(item.total_price) : unitPrice * quantity;
    subtotal += totalPrice;

    const itemData = [
      item.product_name || 'N/A', // Description
      quantity,
      unitPrice.toFixed(2),
      totalPrice.toFixed(2)
    ];
    tableRows.push(itemData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: currentY, // Start table right below title bar
    theme: 'striped', // Cleaner look
    styles: { fontSize: 9, cellPadding: 2, lineColor: [220, 220, 220], lineWidth: 0.1 },
    headStyles: {
      fillColor: [245, 245, 245], // Lighter header
      textColor: [50, 50, 50],
      fontStyle: 'bold',
      lineColor: [180, 180, 180],
    },
    columnStyles: {
      0: { cellWidth: 'auto' }, // Description wider
      1: { halign: 'center', cellWidth: 15 }, // QTY
      2: { halign: 'right', cellWidth: 30 }, // Unit Price
      3: { halign: 'right', cellWidth: 30 }, // Amount
    },
    margin: { top: 0, bottom: 0, left: margin, right: margin } // Ensure table stays within margins
  });

  currentY = (doc).lastAutoTable.finalY; // Get Y position after table

  // --- 5. Totals Section ---
  const totalsTableY = currentY + 5;
  const totalsTableX = pageWidth / 2 + 10; // Start in right half
  const totalsTableWidth = pageWidth - totalsTableX - margin;

  autoTable(doc, {
      body: [
          [{ content: 'SUBTOTAL', styles: { fontStyle: 'bold', halign: 'right' } }, { content: `${currencySymbol}${subtotal.toFixed(2)}`, styles: { halign: 'right' } }],
          // Add 'Other' or 'Tax' rows here if needed
          // [{ content: 'TAX (10%)', styles: { fontStyle: 'bold', halign: 'right' } }, { content: `${currencySymbol}${(subtotal * 0.1).toFixed(2)}`, styles: { halign: 'right' } }],
          [{ content: 'TOTAL QUOTE', styles: { fontStyle: 'bold', halign: 'right', fillColor: [230, 230, 230] } }, { content: `${currencySymbol}${parseFloat(quote.total_amount || subtotal).toFixed(2)}`, styles: { fontStyle: 'bold', halign: 'right', fillColor: [230, 230, 230] } }],
      ],
      startY: totalsTableY,
      theme: 'grid', // Use grid for clear separation
      tableWidth: totalsTableWidth,
      margin: { left: totalsTableX },
      styles: { fontSize: 9, cellPadding: 1.5, lineColor: [180, 180, 180], lineWidth: 0.1 },
      columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 30 } } // Adjust widths as needed
  });

  currentY = (doc).lastAutoTable.finalY + 5; // Update Y position

  // --- 6. Disclaimer Text ---
  doc.setFontSize(8); doc.setFont(undefined, 'normal'); doc.setTextColor(100);
  const disclaimer = "This quotation is not a contract or a bill. It is our best guess at the total price for the service and goods described above. The customer will be billed after indicating acceptance of this quote. Payment will be due prior to the delivery of service and goods. Please fax or mail the signed quote to the address listed above.";
  const splitDisclaimer = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(splitDisclaimer, margin, currentY);
  currentY += splitDisclaimer.length * 3 + 5; // Adjust Y

  // --- 7. Acceptance Section ---
  doc.setFontSize(9); doc.setFont(undefined, 'bold'); doc.setTextColor(0);
  doc.text("Customer Acceptance", margin, currentY); currentY += 8;
  doc.setDrawColor(0);
  // Signature Line
  doc.line(margin, currentY, margin + 80, currentY); // Line for signature
  doc.setFontSize(8); doc.setFont(undefined, 'normal'); doc.setTextColor(100);
  doc.text("Signature", margin, currentY + 3);
  // Printed Name Line
  doc.line(margin + 90, currentY, margin + 140, currentY); // Line for name
  doc.text("Printed Name", margin + 90, currentY + 3);
  // Date Line
  doc.line(margin + 150, currentY, pageWidth - margin, currentY); // Line for date
  doc.text("Date", margin + 150, currentY + 3);
  currentY += 10;

  // --- 8. Footer Contact Info ---
  doc.setFontSize(8); doc.setFont(undefined, 'normal'); doc.setTextColor(100);
  doc.text("If you have any questions, please contact Samyak Sanghavi, +91 9876543223, samyak@address.com", pageWidth / 2, pageHeight - margin + 5, { align: 'center' });


  // --- 9. Save the PDF ---
  const fileName = `Quotation_${quoteId}_${(quote.supplier_name || 'Quote').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(fileName);
};