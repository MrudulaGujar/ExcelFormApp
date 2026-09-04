const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const excelPath = path.join(__dirname, "employee.xlsx");
const pdfPath = path.join(__dirname, "employee-report.pdf");

async function generateEmployeePDF() {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(excelPath);

  const worksheet = workbook.getWorksheet("Employees");

  if (!worksheet) {
    throw new Error("Employees worksheet not found.");
  }

  console.log("Generating PDF from Excel...");

  // Print Excel data being used for PDF
  worksheet.eachRow((row, rowNumber) => {
    console.log(
      "PDF Row:",
      rowNumber,
      "| Name:",
      row.getCell(1).value,
      "| Employee ID:",
      row.getCell(2).value,
      "| Department:",
      row.getCell(3).value
    );
  });

  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  const stream = fs.createWriteStream(pdfPath);

  doc.pipe(stream);

  // =========================
  // TITLE
  // =========================

  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("Employee Report", {
      align: "center",
    });

  doc.moveDown(1);

  // =========================
  // TABLE HEADER
  // =========================

  const headerY = 100;

  doc
    .fontSize(12)
    .font("Helvetica-Bold");

  doc.text("Name", 50, headerY);
  doc.text("Employee ID", 220, headerY);
  doc.text("Department", 370, headerY);

  doc
    .moveTo(50, headerY + 20)
    .lineTo(550, headerY + 20)
    .stroke();

  // =========================
  // EMPLOYEE ROWS
  // =========================

  let y = 135;

  worksheet.eachRow((row, rowNumber) => {

    // Skip Excel header row
    if (rowNumber === 1) {
      return;
    }

    const name = row.getCell(1).value || "";
    const employeeId = row.getCell(2).value || "";
    const department = row.getCell(3).value || "";

    console.log(
      "Adding to PDF:",
      name,
      employeeId,
      department
    );

    doc
      .fontSize(11)
      .font("Helvetica");

    doc.text(String(name), 50, y, {
      width: 150,
    });

    doc.text(String(employeeId), 220, y, {
      width: 120,
    });

    doc.text(String(department), 370, y, {
      width: 150,
    });

    y += 30;

    // New page when required
    if (y > 750) {
      doc.addPage();

      y = 50;
    }
  });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => {
      console.log("PDF created:", pdfPath);
      resolve(pdfPath);
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
}

module.exports = {
  generateEmployeePDF,
};