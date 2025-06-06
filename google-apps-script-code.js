
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheetId = 'PASTE_YOUR_GOOGLE_SHEETS_ID_HERE'; // Get this from your Google Sheets URL
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Handle different types of submissions
    switch(data.type) {
      case 'waitlist':
        return handleWaitlistSubmission(spreadsheet, data);
      case 'contact':
        return handleContactSubmission(spreadsheet, data);
      case 'newsletter':
        return handleNewsletterSubmission(spreadsheet, data);
      default:
        // Backward compatibility - treat as waitlist if no type specified
        return handleWaitlistSubmission(spreadsheet, data);
    }
  } catch (error) {
    console.error('Error processing submission:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleWaitlistSubmission(spreadsheet, data) {
  // Get or create 'Waitlist' sheet
  let sheet = spreadsheet.getSheetByName('Waitlist');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Waitlist');
    // Add headers
    sheet.getRange(1, 1, 1, 7).setValues([['Timestamp', 'Name', 'Email', 'User Type', 'Health Goal', 'Dietary Concern', 'Source']]);
  }
  
  // Add the new row
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name,
    data.email,
    data.userType,
    data.healthGoal,
    data.dietaryConcern,
    data.source || 'Website'
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'Waitlist entry saved' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleContactSubmission(spreadsheet, data) {
  // Get or create 'Contact' sheet
  let sheet = spreadsheet.getSheetByName('Contact');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Contact');
    // Add headers
    sheet.getRange(1, 1, 1, 5).setValues([['Timestamp', 'Name', 'Email', 'Reason', 'Message']]);
  }
  
  // Add the new row
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name,
    data.email,
    data.reason,
    data.message
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'Contact submission saved' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleNewsletterSubmission(spreadsheet, data) {
  // Get or create 'Newsletter' sheet
  let sheet = spreadsheet.getSheetByName('Newsletter');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Newsletter');
    // Add headers
    sheet.getRange(1, 1, 1, 3).setValues([['Timestamp', 'Email', 'Name']]);
  }
  
  // Add the new row
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.email,
    data.name || ''
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'Newsletter subscription saved' }))
    .setMimeType(ContentService.MimeType.JSON);
}
