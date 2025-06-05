
import { sendMessage } from '../chatbot-library';

// Example usage of the sendMessage function
sendMessage("Siapa namamu?", "microsoft/phi-4-reasoning-plus:free")
    .then(response => {
        console.log("AI Response:", response);
    })
    .catch(error => {
        console.error("Error:", error);
    });

