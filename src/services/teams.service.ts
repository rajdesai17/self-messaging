import { AuthService } from './auth.service';
import { Client } from '@microsoft/microsoft-graph-client';

interface UserProfile {
  id: string;
  displayName: string;
  userPrincipalName: string;
}

interface MessageResponse {
  id: string;
  createdDateTime: string;
  body: {
    content: string;
  };
}

export class TeamsService {
  private static instance: TeamsService;
  private authService: AuthService;

  private constructor() {
    this.authService = AuthService.getInstance();
  }

  static getInstance(): TeamsService {
    if (!TeamsService.instance) {
      TeamsService.instance = new TeamsService();
    }
    return TeamsService.instance;
  }

  async getUserProfile(): Promise<UserProfile> {
    const client = await this.authService.getGraphClient();
    const user = await client.api(`/users/${process.env.USER_EMAIL}`).get();
    return {
      id: user.id,
      displayName: user.displayName,
      userPrincipalName: user.userPrincipalName,
    };
  }

  async createChat(userId: string): Promise<string> {
    const client = await this.authService.getGraphClient();
    const chat = await client.api('/chats').post({
      chatType: 'oneOnOne',
      members: [
        {
          '@odata.type': '#microsoft.graph.aadUserConversationMember',
          roles: ['owner'],
          'user@odata.bind': `https://graph.microsoft.com/v1.0/users('${userId}')`,
        },
      ],
    });
    return chat.id;
  }

  async sendMessage(chatId: string, content: string): Promise<MessageResponse> {
    const client = await this.authService.getGraphClient();
    return await client.api(`/chats/${chatId}/messages`).post({
      body: {
        content,
      },
    });
  }

  async getChatMessages(chatId: string): Promise<MessageResponse[]> {
    const client = await this.authService.getGraphClient();
    const response = await client.api(`/chats/${chatId}/messages`).get();
    return response.value;
  }
} 