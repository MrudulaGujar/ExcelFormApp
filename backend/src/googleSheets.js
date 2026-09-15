const { google } = require("googleapis");
const path = require("path");
require("dotenv").config();

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(
    __dirname,
    "../credentials/google-service-account.json"
  ),
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

const SPREADSHEET_ID =
  process.env.GOOGLE_SPREADSHEET_ID;

const SHEET_NAME = "Candidate Info";


// ============================================================
// GET CANDIDATES
// ============================================================

async function getSheetData() {
  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:C`,
    });

  return response.data.values || [];
}


// ============================================================
// ADD CANDIDATE
// ============================================================

async function addCandidate(candidate) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,

    range: `${SHEET_NAME}!A:C`,

    valueInputOption: "USER_ENTERED",

    insertDataOption: "INSERT_ROWS",

    requestBody: {
      values: [
        [
          candidate.candidateName,
          candidate.candidateNumber,
          candidate.mobileNo,
        ],
      ],
    },
  });

  return {
    candidateName: candidate.candidateName,
    candidateNumber: candidate.candidateNumber,
    mobileNo: candidate.mobileNo,
  };
}


module.exports = {
  sheets,
  SPREADSHEET_ID,
  getSheetData,
  addCandidate,
};