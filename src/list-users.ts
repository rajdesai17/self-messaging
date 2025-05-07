import axios, { AxiosError } from "axios";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
    console.error("ACCESS_TOKEN not found in environment variables");
    process.exit(1);
}

async function main() {
    try {
        const response = await axios.get("https://graph.microsoft.com/v1.0/users", {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
        });

        console.log("Users:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error:", error.response?.data || error.message);
        } else {
            console.error("Error:", error);
        }
    }
}

main(); 