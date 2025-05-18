import axios from 'axios';

// This function sends data to a Google Apps Script Web App
export async function submitToGoogleScript(
  deploymentUrl: string, 
  data: {
    name: string;
    email: string;
    userType: string;
    healthGoal: string;
    dietaryConcern: string;
    source?: string;
  }
): Promise<{ success: boolean; message?: string }> {
  try {
    // Make POST request to the Google Apps Script Web App
    const response = await axios.post(deploymentUrl, data);
    
    // Google Apps Script returns a success message
    if (response.status === 200) {
      return { 
        success: true, 
        message: 'Successfully submitted to Google Sheet' 
      };
    }
    
    return { 
      success: false, 
      message: 'Submission failed' 
    };
  } catch (error) {
    console.error('Error submitting to Google Script:', error);
    return { 
      success: false, 
      message: 'Error submitting to Google Sheet. Please try again.' 
    };
  }
}