const { google } = require("googleapis");
const path = require("path");
require("dotenv").config();

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(
    __dirname,
    "../credentials/google-service-account.json"
  ),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

async function getSheetData() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A1:Z20",
  });

  return response.data.values || [];
}

module.exports = {
  sheets,
  SPREADSHEET_ID,
  getSheetData,
};