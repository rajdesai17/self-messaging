import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define the environment schema
const envSchema = z.object({
  // Azure AD Configuration
  AZURE_TENANT_ID: z.string().min(1, 'Azure Tenant ID is required'),
  AZURE_CLIENT_ID: z.string().min(1, 'Azure Client ID is required'),
  AZURE_CLIENT_SECRET: z.string().min(1, 'Azure Client Secret is required'),
  
  // API Endpoints
  GRAPH_API_ENDPOINT: z.string().url('Graph API endpoint must be a valid URL'),
  AUTH_ENDPOINT: z.string().url('Auth endpoint must be a valid URL'),
  
  // Redirect URI
  REDIRECT_URI: z.string().url('Redirect URI must be a valid URL'),
  
  // Optional Configuration
  PORT: z.string().optional().transform(val => val ? parseInt(val, 10) : 3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`Environment validation failed. Missing or invalid variables: ${missingVars}`);
    }
    throw error;
  }
};

// Create a typed configuration object
export const envConfig = {
  azure: {
    tenantId: parseEnv().AZURE_TENANT_ID,
    clientId: parseEnv().AZURE_CLIENT_ID,
    clientSecret: parseEnv().AZURE_CLIENT_SECRET,
  },
  api: {
    graphEndpoint: parseEnv().GRAPH_API_ENDPOINT,
    authEndpoint: parseEnv().AUTH_ENDPOINT,
  },
  redirect: {
    uri: parseEnv().REDIRECT_URI,
  },
  server: {
    port: parseEnv().PORT,
    environment: parseEnv().NODE_ENV,
  },
  logging: {
    level: parseEnv().LOG_LEVEL,
  },
} as const;

// Export type for the configuration
export type EnvConfig = typeof envConfig; 