import { PublicClientApplication, LogLevel } from "@azure/msal-node";
import open from "open";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const config = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID!,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel: LogLevel, message: string) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: LogLevel.Info,
        }
    }
};

const REDIRECT_URI = "http://localhost:3000/auth/callback";
const pca = new PublicClientApplication(config);

const authCodeUrlParameters = {
    scopes: [
        "User.Read",
        "Chat.ReadWrite",
        "Chat.Create"
    ],
    redirectUri: REDIRECT_URI,
};

async function main() {
    // Start a local server to receive the auth code
    const server = http.createServer(async (req, res) => {
        if (req.url && req.url.startsWith("/auth/callback")) {
            const url = new URL(req.url, `http://localhost:3000`);
            const code = url.searchParams.get("code");
            if (code) {
                const tokenResponse = await pca.acquireTokenByCode({
                    code,
                    scopes: authCodeUrlParameters.scopes,
                    redirectUri: REDIRECT_URI,
                });
                res.end("Authentication successful! You can close this window.");
                console.log("Access Token:", tokenResponse?.accessToken);
                server.close();
            } else {
                res.end("No code found.");
            }
        }
    }).listen(3000);

    // Open browser for user login
    const authUrl = await pca.getAuthCodeUrl(authCodeUrlParameters);
    await open(authUrl);
}

main(); 