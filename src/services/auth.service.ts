import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import dotenv from 'dotenv';

dotenv.config();

export class AuthService {
  private static instance: AuthService;
  private graphClient: Client | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async getGraphClient(): Promise<Client> {
    if (this.graphClient) {
      return this.graphClient;
    }

    const credential = new ClientSecretCredential(
      process.env.AZURE_TENANT_ID!,
      process.env.AZURE_CLIENT_ID!,
      process.env.AZURE_CLIENT_SECRET!
    );

    this.graphClient = Client.init({
      authProvider: async (done) => {
        try {
          const token = await credential.getToken(['https://graph.microsoft.com/.default']);
          done(null, token.token);
        } catch (error) {
          done(error as Error, null);
        }
      }
    });

    return this.graphClient;
  }

  async getAccessToken(): Promise<string> {
    const credential = new ClientSecretCredential(
      process.env.AZURE_TENANT_ID!,
      process.env.AZURE_CLIENT_ID!,
      process.env.AZURE_CLIENT_SECRET!
    );
    const token = await credential.getToken(['https://graph.microsoft.com/.default']);
    return token.token;
  }
} 