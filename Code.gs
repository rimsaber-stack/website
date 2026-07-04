// 1. Create a Google Sheet
// 2. Extensions > Apps Script > paste this code
// 3. Deploy > New Deployment > Web App > Execute as "Me", Anyone can access
// 4. Copy the web app URL and paste it into index.html

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  // Add header row if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'First Name', 'Last Name', 'Phone', 'Address', 'City', 'Items', 'Total']);
  }

  sheet.appendRow([
    new Date(),
    data.firstName,
    data.lastName,
    data.phone,
    data.address,
    data.city,
    data.items,
    data.total
  ]);

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return doPost(e);
}
