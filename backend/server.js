const express = require("express");
const cors = require("cors");

const { saveEmployee } = require("./excelService");
const { generateEmployeePDF } = require("./pdfService");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/api/employees", async (req, res) => {
  try {
    const { name, employeeId, department } = req.body;

    console.log("Received data:");
    console.log("Name:", name);
    console.log("Employee ID:", employeeId);
    console.log("Department:", department);

    // Save data to Excel
    await saveEmployee({
      name,
      employeeId,
      department,
    });

    res.json({
      success: true,
      message: "Employee data saved successfully",
    });

  } catch (error) {
    console.error("Error saving employee:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save employee data",
    });
  }
});

app.get("/api/employees/pdf", async (req, res) => {
  try {
    const pdfPath = await generateEmployeePDF();

    res.download(pdfPath, "employee-report.pdf");
  } catch (error) {
    console.error("PDF generation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate PDF",
    });
  }
});

app.listen(5001, "0.0.0.0", () => {
  console.log("Backend running on port 5001");
});