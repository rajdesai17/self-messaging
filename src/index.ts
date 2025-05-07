import { TeamsService } from './services/teams.service';
import { AuthService } from './services/auth.service';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  // Get and print access token
  const authService = AuthService.getInstance();
  const accessToken = await authService.getAccessToken();
  console.log('Access Token:', accessToken);

  const teamsService = TeamsService.getInstance();

  // Get user profile and print user ID
  const userProfile = await teamsService.getUserProfile();
  console.log('User ID:', userProfile.id);
  console.log('User profile:', userProfile);

  // Create a chat with yourself and print chat ID
  const chatId = await teamsService.createChat(userProfile.id);
  console.log('Chat created with ID:', chatId);

  // Send a test message and print response
  const testMessage = `Hello! This is a test message sent at ${new Date().toISOString()}`;
  const messageResponse = await teamsService.sendMessage(chatId, testMessage);
  console.log('Message sent:', messageResponse);

  // Retrieve chat messages and print
  const messages = await teamsService.getChatMessages(chatId);
  console.log('Chat messages:', messages);
}

main().catch(console.error); 