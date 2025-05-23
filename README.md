﻿# Microsoft Teams Self-Messaging (Graph API)

## What is this?
A Node.js script to send a message to yourself in Microsoft Teams using Microsoft Graph API. Supports both application and delegated (user login) flows.

## Setup
1. **Clone the repo & install dependencies**
   ```powershell
   git clone <repo-url>
   cd self-messaging
   npm install
   ```

2. **Azure App Registration**
   - Register an app in Azure AD (App registrations).
   - Add **Redirect URI**: `http://localhost:3000/auth/callback` (Web and MOBILE AND DESKTOP APP).
   - Under **API permissions**, add and grant admin consent for (Delegated):
     - Chat.Create
     - Chat.ReadWrite
     - Chat.ReadWrite.All
     - User.Read
     - User.Read.All
   - (For app-only flow, add Application permissions for the same scopes.)
   - <img src="https://github.com/user-attachments/assets/9faab1ce-fa72-4409-8098-63fefef81bfe" width="600"/>
   - <img src="https://github.com/user-attachments/assets/36297ac2-a4e2-4353-8b3c-2c616d19b9e5" width="600"/>
   - <img src="https://github.com/user-attachments/assets/93944770-4de2-4370-9db8-bb90832760ba" width="600"/>



3. **.env file**
   Copy `.env.example` to `.env` and fill in:
   ```env
   AZURE_CLIENT_ID=your-client-id
   AZURE_TENANT_ID=your-tenant-id
   # No client secret needed for user login
   ```

## How to Test (Delegated/User Login)
1. **Login and get access token:**
   ```powershell
   npx ts-node src/login.ts
   ```
   - Sign in with your Azure AD (work/school) account in the browser.
   - Copy the access token from the console.

2. **Send a message to yourself in Teams:**
   - Paste the access token in `src/send-self-message.ts` (`ACCESS_TOKEN` variable).
   - Run:
     ```powershell
     npx ts-node src/send-self-message.ts
     ```
   - You should see your user info, chat creation, and message response in the console. The message will appear in your Teams chat with yourself.

## Notes
- You must use a **work/school (Azure AD) account**. Personal Microsoft accounts (like Gmail/Outlook.com) will not work for Teams Graph API.
- Make sure permissions are granted and consented in Azure.

---
That's it! This is a minimal, testable Teams self-messaging setup for devs and tech leads.
