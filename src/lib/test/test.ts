
import { sendMessage } from '../chatbot-library';




sendMessage("Siapa namamu?", "rakuten/rakutenai-7b-chat")
    .then(response => {
        console.log("AI Response:", response);
    })
    .catch(error => {
        console.error("Error:", error);
    });

