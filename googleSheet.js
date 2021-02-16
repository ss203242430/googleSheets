const { GoogleSpreadsheet } = require('google-spreadsheet');

const docID = '1D_DVlgULHm3JN3f5XQeWLpPp7TCXIL-WSQWYojjFqEA';
const sheetID = '0'; 
const credentialsPath = './credentials.json';

async function getData() {
  const result = [];
  const doc = new GoogleSpreadsheet(docID);
  const creds = require(credentialsPath);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsById[sheetID];
  const rows = await sheet.getRows();
  for (row of rows) {
    result.push(row._rawData);
  }
  return result;
};

async function appendRow(data) {
  const result = [];
  const doc = new GoogleSpreadsheet(docID);
  const creds = require(credentialsPath);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsById[sheetID];
  const larryRow = await sheet.addRow(data);
  return larryRow
};

module.exports = {
  getData,
  appendRow
};