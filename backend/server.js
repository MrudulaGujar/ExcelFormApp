require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { getSheetData } = require("./src/googleSheets");

const app = express();

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});