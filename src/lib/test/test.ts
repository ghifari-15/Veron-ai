
import { sendMessage } from '../chatbot-library';




sendMessage("10 + 10 berapa", "qwen-max-latest")
    .then(response => {
        console.log("AI Response:", response.content);
    })
    .catch(error => {
        console.error("Error:", error);
    });

