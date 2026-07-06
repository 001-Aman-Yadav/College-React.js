import PDFDocument from 'pdfkit';

/**
 * Builds a styled fee receipt PDF in the given writeable stream
 */
export const buildReceiptPDF = (stream, payment, student, course) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(stream);

  // Colors
  const primaryColor = '#1e3a8a'; // Deep blue
  const secondaryColor = '#4b5563'; // Gray
  const darkColor = '#1f2937';

  // --- HEADER ---
  doc.rect(0, 0, 595.28, 15).fill(primaryColor); // Top bar

  doc.moveDown(2);
  doc.fillColor(primaryColor).fontSize(22).text('METROPOLITAN UNIVERSITY', { align: 'center', bold: true });
  doc.fontSize(10).fillColor(secondaryColor).text('123 Education Campus, Academic Zone, New Delhi - 110001', { align: 'center' });
  doc.text('Phone: +91 11 23456789 | Email: contact@metrouni.edu.in', { align: 'center' });
  doc.moveDown(1.5);

  // Line separator
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#d1d5db').lineWidth(1).stroke();
  doc.moveDown(1.5);

  // Title
  doc.fillColor(darkColor).fontSize(14).text('FEE RECEIPT', { align: 'center', underline: true });
  doc.moveDown(1);

  // --- RECEIPT & STUDENT INFO MATRIX ---
  const leftColX = 50;
  const rightColX = 320;
  const startY = doc.y;

  // Left column (Receipt details)
  doc.fontSize(10).fillColor(secondaryColor).text('Receipt No:', leftColX, startY);
  doc.fillColor(darkColor).text(payment.receiptNumber, leftColX + 90, startY);

  doc.fillColor(secondaryColor).text('Payment Date:', leftColX, startY + 20);
  doc.fillColor(darkColor).text(new Date(payment.paymentDate).toLocaleDateString(), leftColX + 90, startY + 20);

  doc.fillColor(secondaryColor).text('Transaction ID:', leftColX, startY + 40);
  doc.fillColor(darkColor).text(payment.transactionId, leftColX + 90, startY + 40);

  doc.fillColor(secondaryColor).text('Payment Mode:', leftColX, startY + 60);
  doc.fillColor(darkColor).text(payment.method, leftColX + 90, startY + 60);

  // Right column (Student details)
  doc.fillColor(secondaryColor).text('Student Name:', rightColX, startY);
  doc.fillColor(darkColor).text(`${student.firstName} ${student.lastName}`, rightColX + 90, startY);

  doc.fillColor(secondaryColor).text('Admission No:', rightColX, startY + 20);
  doc.fillColor(darkColor).text(student.admissionNumber || 'N/A', rightColX + 90, startY + 20);

  doc.fillColor(secondaryColor).text('Roll Number:', rightColX, startY + 40);
  doc.fillColor(darkColor).text(student.rollNumber || 'N/A', rightColX + 90, startY + 40);

  doc.fillColor(secondaryColor).text('Course / Program:', rightColX, startY + 60);
  doc.fillColor(darkColor).text(course.name, rightColX + 90, startY + 60);

  doc.moveDown(5);

  // --- FEE ITEMIZATION TABLE ---
  const tableTop = doc.y + 10;
  doc.rect(50, tableTop, 495, 25).fill(primaryColor);

  doc.fillColor('#ffffff').fontSize(10);
  doc.text('SI.No', 65, tableTop + 8);
  doc.text('Description', 120, tableTop + 8);
  doc.text('Amount Paid', 450, tableTop + 8, { align: 'right', width: 80 });

  // Table row
  const rowTop = tableTop + 25;
  doc.fillColor(darkColor);
  doc.text('1', 65, rowTop + 10);
  doc.text(`${payment.type} Fee Payment (${course.name})`, 120, rowTop + 10);
  doc.text(`INR ${payment.amount.toLocaleString()}.00`, 450, rowTop + 10, { align: 'right', width: 80 });

  // Border lines for table row
  doc.rect(50, rowTop, 495, 30).strokeColor('#e5e7eb').lineWidth(1).stroke();

  // Total row
  const totalTop = rowTop + 30;
  doc.rect(50, totalTop, 495, 25).fill('#f3f4f6');
  doc.fillColor(darkColor).fontSize(10);
  doc.text('Total Amount Paid:', 300, totalTop + 8, { bold: true });
  doc.text(`INR ${payment.amount.toLocaleString()}.00`, 450, totalTop + 8, { align: 'right', width: 80, bold: true });

  doc.moveDown(3);

  // --- TERMS & SIGNATURES ---
  const remarksY = doc.y + 40;
  doc.fontSize(8).fillColor(secondaryColor).text('Note: This is an electronically generated fee receipt and does not require physical signature.', 50, remarksY);
  doc.text('Refund Policy: Fees once paid are non-refundable and non-transferable under any circumstances.', 50, remarksY + 12);

  // Signatures
  doc.fontSize(10).fillColor(darkColor);
  doc.text('Accountant Signatory', 420, remarksY + 30, { align: 'center' });
  doc.moveTo(400, remarksY + 28).lineTo(540, remarksY + 28).strokeColor('#9ca3af').stroke();

  doc.end();
};

/**
 * Builds a styled digital Student ID Card PDF in the given writeable stream
 */
export const buildIDCardPDF = (stream, student, course) => {
  // A6 landscape-ish size for ID card (e.g. Width: 320, Height: 200)
  const doc = new PDFDocument({ size: [320, 200], margin: 10 });
  doc.pipe(stream);

  // Card background and border
  doc.rect(5, 5, 310, 190).fill('#ffffff').strokeColor('#1e3a8a').lineWidth(3).stroke();

  // Top header bar
  doc.rect(5, 5, 310, 35).fill('#1e3a8a');
  doc.fillColor('#ffffff').fontSize(11).text('METROPOLITAN UNIVERSITY', 10, 12, { align: 'center', bold: true });
  doc.fontSize(6).text('IDENTITY CARD', 10, 26, { align: 'center' });

  // Photo Box (Left)
  doc.rect(15, 55, 60, 75).fill('#e5e7eb').strokeColor('#cbd5e1').lineWidth(1).stroke();
  doc.fillColor('#9ca3af').fontSize(8).text('PHOTO', 33, 90);

  // Student Details (Center-Right)
  const detailsX = 90;
  doc.fillColor('#1f2937').fontSize(10).text(`${student.firstName} ${student.lastName}`.toUpperCase(), detailsX, 55, { bold: true });

  doc.fontSize(7).fillColor('#4b5563');
  doc.text('Admission No:', detailsX, 75);
  doc.fillColor('#111827').text(student.admissionNumber || 'PENDING', detailsX + 60, 75);

  doc.fillColor('#4b5563').text('Roll Number:', detailsX, 87);
  doc.fillColor('#111827').text(student.rollNumber || 'PENDING', detailsX + 60, 87);

  doc.fillColor('#4b5563').text('Course:', detailsX, 99);
  doc.fillColor('#111827').text(course.name, detailsX + 60, 99);

  doc.fillColor('#4b5563').text('DOB:', detailsX, 111);
  doc.fillColor('#111827').text(new Date(student.dob).toLocaleDateString(), detailsX + 60, 111);

  doc.fillColor('#4b5563').text('Contact:', detailsX, 123);
  doc.fillColor('#111827').text(student.mobile, detailsX + 60, 123);

  // Draw a simulated barcode pattern (as a nice digital card visual indicator)
  const barcodeY = 150;
  doc.rect(15, barcodeY, 120, 20).fill('#f3f4f6').strokeColor('#e5e7eb').stroke();
  // Drawing barcode lines
  doc.fillColor('#000000');
  for (let i = 0; i < 24; i++) {
    const width = (i % 3 === 0) ? 2 : 1;
    doc.rect(20 + (i * 4), barcodeY + 2, width, 16).fill();
  }

  // QR Code placeholder/Visual box on right bottom
  const qrX = 265;
  const qrY = 135;
  doc.rect(qrX, qrY, 40, 40).fill('#ffffff').strokeColor('#1e3a8a').lineWidth(1.5).stroke();
  // Draw some mock QR patterns inside
  doc.fillColor('#1e3a8a');
  doc.rect(qrX + 3, qrY + 3, 10, 10).fill(); // Top left marker
  doc.rect(qrX + 27, qrY + 3, 10, 10).fill(); // Top right marker
  doc.rect(qrX + 3, qrY + 27, 10, 10).fill(); // Bottom left marker
  // Mock dot patterns
  doc.rect(qrX + 16, qrY + 8, 4, 4).fill();
  doc.rect(qrX + 8, qrY + 16, 4, 4).fill();
  doc.rect(qrX + 20, qrY + 20, 8, 4).fill();
  doc.rect(qrX + 16, qrY + 28, 4, 8).fill();
  doc.rect(qrX + 28, qrY + 20, 4, 4).fill();

  // Bottom text footer
  doc.rect(5, 180, 310, 15).fill('#e5e7eb');
  doc.fillColor('#1e3a8a').fontSize(6).text('If found, return to Metropolitan University. Valid up to June 2029.', 10, 185, { align: 'center' });

  doc.end();
};
