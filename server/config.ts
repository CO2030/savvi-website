// Server environment configuration

export interface AppConfig {
  // Google Apps Script Integration
  googleScriptDeploymentUrl: string | undefined;
  // Base URL for the application
  baseUrl: string;
}

// Load and validate environment variables
export function loadConfig(): AppConfig {
  // Get Google Script deployment URL from environment
  const googleScriptDeploymentUrl = process.env.GOOGLE_SCRIPT_DEPLOYMENT_URL;
  
  // Determine base URL based on environment
  // Production: Use actual domain
  // Development: Use Replit domain for email testing (external email clients need public URLs)
  // Local: Use localhost for local development
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://savviwell.com'
    : process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : `http://localhost:${process.env.PORT || 5000}`;
  
  return {
    googleScriptDeploymentUrl,
    baseUrl
  };
}

// Singleton instance of the config
export const config = loadConfig();