import axios, { AxiosError } from "axios";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const USER_ID = "57c2938e-459a-4da8-b0d6-bba3fc384003"; // From the list-users.ts output

if (!ACCESS_TOKEN) {
    console.error("ACCESS_TOKEN not found in environment variables");
    process.exit(1);
}

async function main() {
    try {
        // 1. Get user profile by ID
        const user = await axios.get(`https://graph.microsoft.com/v1.0/users/${USER_ID}`, {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
        });
        console.log("User profile:", user.data);

        // 2. Create a chat with yourself
        const chat = await axios.post("https://graph.microsoft.com/v1.0/chats", {
            chatType: "oneOnOne",
            members: [
                {
                    "@odata.type": "#microsoft.graph.aadUserConversationMember",
                    roles: ["owner"],
                    "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${USER_ID}')`
                }
            ]
        }, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Chat created:", chat.data);

        // 3. Send a message to the chat
        const message = await axios.post(
            `https://graph.microsoft.com/v1.0/chats/${chat.data.id}/messages`,
            {
                body: { content: "Hello! This is a message to myself." }
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("Message sent:", message.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response) {
                console.error("Error response:", error.response.data);
            } else {
                console.error("Error:", error.message);
            }
        } else {
            console.error("Unknown error:", error);
        }
    }
}

main();