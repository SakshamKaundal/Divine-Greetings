function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
     
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please check your .env.local file or deployment environment variables.`
    );
  }
     
  return value;
}

function validateEnvVars() {
  const required = ['GEMINI_API_KEY', 'HUGGING_FACE_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
     
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env.local file or deployment configuration.\n\n` +
      `Required variables:\n` +
      `- GEMINI_API_KEY: Get from https://aistudio.google.com/app/apikey\n` +
      `- HUGGING_FACE_API_KEY: Get from https://huggingface.co/settings/tokens (starts with 'hf_')`
    );
  }
}

function validateHuggingFaceToken(token: string) {
  if (!token.startsWith('hf_')) {
    console.warn(
      `⚠️  HUGGING_FACE_API_KEY should start with 'hf_' but got: ${token.substring(0, 10)}...\n` +
      `Make sure you copied the correct token from https://huggingface.co/settings/tokens`
    );
  }
}

// Validate environment variables on module load
validateEnvVars();

// Additional validation for Hugging Face token format
if (process.env.HUGGING_FACE_API_KEY) {
  validateHuggingFaceToken(process.env.HUGGING_FACE_API_KEY);
}

export const env = {
  GEMINI_API_KEY: getEnvVar('GEMINI_API_KEY'),
  HUGGING_FACE_API_KEY: getEnvVar('HUGGING_FACE_API_KEY'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // Optional API keys (with fallbacks for graceful degradation)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '', // Optional for future DALL-E integration
  STABILITY_API_KEY: process.env.STABILITY_API_KEY || '', // Optional for Stability AI
} as const;

export default env;