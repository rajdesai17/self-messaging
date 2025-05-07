import { AuthService } from './services/auth.service';
import { TeamsService } from './services/teams.service';
import { envConfig } from './utils/env-validator';
import dotenv from 'dotenv';

dotenv.config();

async function testSetup() {
  try {
    console.log('Testing Azure AD Setup...\n');

    // Test 1: Environment Variables
    console.log('Test 1: Checking Environment Variables...');
    console.log('Environment configuration:');
    console.log(`- Tenant ID: ${envConfig.azure.tenantId}`);
    console.log(`- Client ID: ${envConfig.azure.clientId}`);
    console.log(`- Graph API Endpoint: ${envConfig.api.graphEndpoint}`);
    console.log(`- Auth Endpoint: ${envConfig.api.authEndpoint}`);
    console.log(`- Redirect URI: ${envConfig.redirect.uri}`);
    console.log('✅ Environment variables are properly configured\n');

    // Test 2: Authentication
    console.log('Test 2: Testing Authentication...');
    const authService = AuthService.getInstance();
    const token = await authService.getAccessToken();
    console.log('✅ Successfully obtained access token\n');

    // Test 3: User Profile
    console.log('Test 3: Testing User Profile Access...');
    const teamsService = TeamsService.getInstance();
    const userProfile = await teamsService.getUserProfile();
    console.log('✅ Successfully retrieved user profile:');
    console.log(`   Name: ${userProfile.displayName}`);
    console.log(`   Email: ${userProfile.userPrincipalName}\n`);

    // Test 4: Chat Creation
    console.log('Test 4: Testing Chat Creation...');
    const chatId = await teamsService.createChat(userProfile.id);
    console.log(`✅ Successfully created chat with ID: ${chatId}\n`);

    // Test 5: Message Sending
    console.log('Test 5: Testing Message Sending...');
    const testMessage = 'Test message from setup verification';
    const messageResponse = await teamsService.sendMessage(chatId, testMessage);
    console.log('✅ Successfully sent test message\n');

    console.log('🎉 All tests passed! Your setup is working correctly.');
  } catch (error) {
    console.error('\n❌ Setup Test Failed:', error);
    process.exit(1);
  }
}

// Run the test
testSetup(); 