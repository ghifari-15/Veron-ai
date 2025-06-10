
import { sendMessage } from '../chatbot-library';

// Example usage of the sendMessage function
sendMessage("Siapa namamu?", "qwen/qwen3-8b:free")
    .then(response => {
        console.log("AI Response:", response);
    })
    .catch(error => {
        console.error("Error:", error);
    });

