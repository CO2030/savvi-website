import axios from 'axios';

export interface WaitlistSubmissionData {
  name: string;
  email: string;
  userType: "individual" | "parent" | "caregiver" | "older-adult";
  healthGoal: "energy" | "gut-health" | "blood-sugar" | "weight-loss" | "other";
  dietaryConcern: "gluten-free" | "vegan" | "low-sugar" | "none";
  source?: string;
}

// This function sends waitlist data to a Google Apps Script Web App
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
    const response = await axios.post(deploymentUrl, {
      ...data,
      type: 'waitlist',
      timestamp: new Date().toISOString()
    });

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

// Submit contact form data to Google Sheets
export async function submitContactToGoogleScript(
  deploymentUrl: string,
  data: {
    name: string;
    email: string;
    reason: string;
    message: string;
    source?: string;
  }
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await axios.post(deploymentUrl, {
      ...data,
      type: 'contact',
      timestamp: new Date().toISOString()
    });

    if (response.status === 200) {
      return { 
        success: true, 
        message: 'Contact submission saved to Google Sheet' 
      };
    }

    return { 
      success: false, 
      message: 'Contact submission failed' 
    };
  } catch (error) {
    console.error('Error submitting contact to Google Script:', error);
    return { 
      success: false, 
      message: 'Error submitting contact to Google Sheet.' 
    };
  }
}

// Submit newsletter subscription to Google Sheets
export async function submitNewsletterToGoogleScript(
  deploymentUrl: string,
  data: {
    email: string;
    name?: string;
    source?: string;
  }
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await axios.post(deploymentUrl, {
      ...data,
      type: 'newsletter',
      timestamp: new Date().toISOString()
    });

    if (response.status === 200) {
      return { 
        success: true, 
        message: 'Newsletter subscription saved to Google Sheet' 
      };
    }

    return { 
      success: false, 
      message: 'Newsletter submission failed' 
    };
  } catch (error) {
    console.error('Error submitting newsletter to Google Script:', error);
    return { 
      success: false, 
      message: 'Error submitting newsletter to Google Sheet.' 
    };
  }
}