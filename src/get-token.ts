import { ConfidentialClientApplication } from "@azure/msal-node";
import dotenv from "dotenv";

dotenv.config();

const msalConfig = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID!,
        clientSecret: process.env.AZURE_CLIENT_SECRET!,
        authority: `${process.env.AUTH_ENDPOINT}/${process.env.AZURE_TENANT_ID}`,
    }
};

const scopes = [
    "Chat.Create",
    "Chat.ReadWrite",
    "Chat.ReadWrite.All",
    "User.Read",
    "User.Read.All"
];

async function getToken() {
    try {
        const msalClient = new ConfidentialClientApplication(msalConfig);
        
        const tokenResponse = await msalClient.acquireTokenByClientCredential({
            scopes: scopes.map(scope => `https://graph.microsoft.com/.default`)
        });

        if (tokenResponse) {
            console.log("Access Token:", tokenResponse.accessToken);
            console.log("\nToken Details:");
            console.log("Expires On:", new Date(tokenResponse.expiresOn!.getTime()).toLocaleString());
            console.log("Scopes:", tokenResponse.scopes);
        }
    } catch (error) {
        console.error("Error getting token:", error);
    }
}

getToken(); 