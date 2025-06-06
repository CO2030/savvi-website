
function doPost(e) {
  try {
    // Add debugging logs
    console.log('Request received:', e);
    console.log('postData:', e.postData);
    
    // Check if postData exists
    if (!e || !e.postData || !e.postData.contents) {
      console.error('Missing postData or contents');
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Missing request data. Please ensure this is a POST request with JSON data.' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', data);
    
    const spreadsheetId = 'PASTE_YOUR_GOOGLE_SHEETS_ID_HERE'; // Get this from your Google Sheets URL
    
    // Check if spreadsheet ID is still placeholder
    if (spreadsheetId === 'PASTE_YOUR_GOOGLE_SHEETS_ID_HERE') {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Please replace PASTE_YOUR_GOOGLE_SHEETS_ID_HERE with your actual Google Sheets ID' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
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
  try {
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
    
    // Send email notification
    try {
      MailApp.sendEmail({
        to: "savviwell@gmail.com",
        subject: "New Waitlist Signup - SavviWell",
        body: `New waitlist signup:\n\nName: ${data.name}\nEmail: ${data.email}\nUser Type: ${data.userType}\nHealth Goal: ${data.healthGoal}\nDietary Concern: ${data.dietaryConcern}\nTimestamp: ${data.timestamp || new Date().toISOString()}`
      });
    } catch (emailError) {
      console.warn('Failed to send email:', emailError);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Waitlist entry saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error in handleWaitlistSubmission:', error);
    throw error;
  }
}

function handleContactSubmission(spreadsheet, data) {
  try {
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
  } catch (error) {
    console.error('Error in handleContactSubmission:', error);
    throw error;
  }
}

function handleNewsletterSubmission(spreadsheet, data) {
  try {
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
  } catch (error) {
    console.error('Error in handleNewsletterSubmission:', error);
    throw error;
  }
}
