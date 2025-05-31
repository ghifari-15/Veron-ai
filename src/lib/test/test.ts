import { Readline } from 'readline/promises';
import { sendMessage } from '../chatbot-library';
import { read } from 'fs';



sendMessage("What is your name?", "qwen-max")
    .then(response => {
        console.log("AI Response:", response.content);
    })
    .catch(error => {
        console.error("Error:", error);
    });

