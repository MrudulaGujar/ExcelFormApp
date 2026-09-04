const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

const filePath = path.join(__dirname, "employee.xlsx");

async function saveEmployee(data) {
  console.log("\n==============================");
  console.log("Saving employee...");
  console.log("Name:", data.name);
  console.log("Employee ID:", data.employeeId);
  console.log("Department:", data.department);
  console.log("==============================");

  const workbook = new ExcelJS.Workbook();

  // ==========================================
  // 1. Load existing Excel file if available
  // ==========================================

  if (fs.existsSync(filePath)) {
    console.log("Existing Excel file found.");

    await workbook.xlsx.readFile(filePath);

    console.log("Existing Excel file loaded.");
  } else {
    console.log("Excel file does not exist. Creating new file.");
  }

  // ==========================================
  // 2. Get or create worksheet
  // ==========================================

  let worksheet = workbook.getWorksheet("Employees");

  if (!worksheet) {
    console.log("Employees worksheet does not exist.");

    worksheet = workbook.addWorksheet("Employees");

    worksheet.columns = [
      {
        header: "Name",
        key: "name",
        width: 25,
      },
      {
        header: "Employee ID",
        key: "employeeId",
        width: 20,
      },
      {
        header: "Department",
        key: "department",
        width: 25,
      },
    ];
  }

  // ==========================================
  // 3. Add new employee
  // ==========================================

  worksheet.addRow([
    data.name,
    data.employeeId,
    data.department,
  ]);

  console.log("\nRows BEFORE writing Excel:");

  worksheet.eachRow((row, rowNumber) => {
    console.log(
      `Row ${rowNumber}:`,
      row.getCell(1).value,
      "|",
      row.getCell(2).value,
      "|",
      row.getCell(3).value
    );
  });

  // ==========================================
  // 4. Save Excel file
  // ==========================================

  await workbook.xlsx.writeFile(filePath);

  console.log("\nExcel file written successfully:");
  console.log(filePath);

  // ==========================================
  // 5. Re-open Excel and verify saved data
  // ==========================================

  const verifyWorkbook = new ExcelJS.Workbook();

  await verifyWorkbook.xlsx.readFile(filePath);

  const verifyWorksheet =
    verifyWorkbook.getWorksheet("Employees");

  console.log("\nRows AFTER writing Excel:");

  verifyWorksheet.eachRow((row, rowNumber) => {
    console.log(
      `Row ${rowNumber}:`,
      row.getCell(1).value,
      "|",
      row.getCell(2).value,
      "|",
      row.getCell(3).value
    );
  });

  console.log("==============================\n");
}

module.exports = {
  saveEmployee,
};

