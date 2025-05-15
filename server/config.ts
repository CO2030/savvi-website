// Server environment configuration

export interface AppConfig {
  // Google Apps Script Integration
  googleScriptDeploymentUrl: string | undefined;
}

// Load and validate environment variables
export function loadConfig(): AppConfig {
  // Get Google Script deployment URL from environment
  const googleScriptDeploymentUrl = process.env.GOOGLE_SCRIPT_DEPLOYMENT_URL;
  
  return {
    googleScriptDeploymentUrl
  };
}

// Singleton instance of the config
export const config = loadConfig();