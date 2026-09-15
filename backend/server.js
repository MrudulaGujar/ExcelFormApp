require("dotenv").config();

const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");

const {
  getSheetData,
  addCandidate,
} = require("./src/googleSheets");

const app = express();

app.use(cors());
app.use(express.json());


// ============================================================
// TEST GOOGLE SHEETS
// ============================================================

app.get("/api/test-sheets", async (req, res) => {
  try {
    const values = await getSheetData();

    res.json({
      success: true,
      values,
    });
  } catch (error) {
    console.error("Google Sheets error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


// ============================================================
// ADD CANDIDATE
// ============================================================

app.post("/api/candidates", async (req, res) => {
  try {
    const {
      candidateName,
      candidateNumber,
      mobileNo,
    } = req.body;

    // Validation
    if (!candidateName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Candidate name is required.",
      });
    }

    if (!candidateNumber?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Candidate number is required.",
      });
    }

    if (!mobileNo?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required.",
      });
    }


    // Save to Google Sheets
    const candidate = await addCandidate({
      candidateName: candidateName.trim(),
      candidateNumber: candidateNumber.trim(),
      mobileNo: mobileNo.trim(),
    });


    res.json({
      success: true,
      message: "Candidate saved successfully.",
      candidate,
    });

  } catch (error) {
    console.error("Add candidate error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save candidate.",
      error: error.message,
    });
  }
});

// Downliad excel
app.get("/api/download-excel", async (req, res) => {
  try {
    const values = await getSheetData();

    if (!values || values.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found in Google Sheet.",
      });
    }

    // Convert Google Sheet data to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(values);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add worksheet
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Candidate Info"
    );

    // Generate Excel file as buffer
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Candidate_Info.xlsx"'
    );

    res.send(excelBuffer);
  } catch (error) {
    console.error("Excel download error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate Excel file.",
      error: error.message,
    });
  }
});


// ============================================================
// START SERVER
// ============================================================

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Backend running on http://localhost:${PORT}`
  );
});