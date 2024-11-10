import PDFDocument from "pdfkit";
import db from "../config/dbConnect.js";
import fs from "fs";

async function createPDF(data) {
  const doc = new PDFDocument();
  const filePath = "invoice.pdf";

  doc.pipe(fs.createWriteStream(filePath));

  const totalAmount = data.totalAmount;
  const items = data.items;
  let subTotal = 0;

  doc.rect(10, 10, 590, 450).stroke("black");
  doc.fontSize(20).text("Invoice", { align: "center" }, doc.y);
  doc.moveDown();
  let docY = doc.y;
  doc
    .fontSize(15)
    .text("Product Name", 50, docY, { underline: true })
    .text("Quantity", 200, docY, { underline: true })
    .text("Unit Price", 300, docY, { underline: true })
    .text("Total", 450, docY, { underline: true });
  doc.moveDown();

  for (const item of items) {
    const [rows] = await db.execute(
      "SELECT productName FROM products WHERE productId = ?",
      [item.productId]
    );
    docY = doc.y;
    if (rows.length > 0) {
      const product = rows[0];
      const total = item.quantity * item.unitPrice;
      doc
        .fontSize(12)
        .text(product.productName, 50, docY)
        .text(item.quantity, 200, docY)
        .text(`Rs ${item.unitPrice}`, 300, docY)
        .text(`Rs ${total}`, 450, docY);
      subTotal += total;
      doc.moveDown();
    } else {
      doc.text(`Product ID ${item.productId} not found`, 100, doc.y);
      doc.moveDown();
    }
  }
  doc.moveDown();
  docY = doc.y;
  doc.fontSize(15).text("Discount:", 50, docY);
  doc.fillColor("red").text(`Rs ${-(subTotal - totalAmount)}`, 450, docY);
  doc.moveDown();
  docY = doc.y;
  doc.fillColor("black").text(`Total Amount:`, 50, docY);
  doc.text(`Rs ${totalAmount}`, 450, docY);

  doc.end();
}

export default createPDF;
