import { sendMessage } from "../chatbot-library";

export async function testChatbot() {
    try {
        const userInput = "Hello, how are you?";
        const response = await sendMessage(userInput);
        console.log("AI Response: ", response);
    } catch (error) {
        console.error("Error during chatbot interaction: ", error);
    }
}

testChatbot();