import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
    console.error("ACCESS_TOKEN not found in environment variables");
    process.exit(1);
}

async function main() {
    // 1. Get your user profile
    const me = await axios.get("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });
    console.log("User profile:", me.data);

    // 2. Create a chat with yourself
    const chat = await axios.post("https://graph.microsoft.com/v1.0/chats", {
        chatType: "oneOnOne",
        members: [
            {
                "@odata.type": "#microsoft.graph.aadUserConversationMember",
                roles: ["owner"],
                "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${me.data.id}')`
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
}

main().catch(console.error); 