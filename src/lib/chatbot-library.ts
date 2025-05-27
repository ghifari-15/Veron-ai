import { ChatOpenAI } from "@langchain/openai";
import { config } from "dotenv";

config();
const apiKey = process.env.DASHSCOPE_API_KEY;
if (!apiKey) {
    throw new Error("DASHSCOPE_API_KEY is not set in the environment variables.");
}

export const availableModels = [
  {
    id: "qwen-turbo",
    name: "Qwen Turbo",
    description: "Ultra-large, multilingual language model with a massively extended context length (1M tokens)",
    provider: "dashscope",
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
  },
  {
    id: "qwen-max",
    name: "Qwen Max",
    description: "Ultra-large, multilingual language model with a massively extended context length (1M tokens)",
    provider: "dashscope",
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",

  },
  {
    id: "qwen-max-latest",
    name: "Qwen Max Latest",
    description: "Ultra-large, multilingual language model with a massively extended context length (1M tokens)",
    provider: "dashscope",
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
  },
  {
    id: "gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    description: "Gemini 2.0 Flash delivers next-gen features and improved capabilities, including superior speed, native tool use, and a 1M token context window.",
    apiKey: process.env.GOOGLE_API_KEY,
  },

]

// Filter available models based on API keys
export const getAvailableModels = () => {
  return availableModels.filter(model => {
    if (!model.apiKey) {
      console.error(`API key for model ${model.name} is not set.`); 
      return false;
    } 
    return true;
  });
}



















const model = new ChatOpenAI({
    model: "qwen-turbo",
    apiKey: apiKey,
    temperature: 0.7,
    configuration: {
      baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    }
  });
 
export async function sendMessage(userInput: string) {
  const aiMessage = await model.invoke(
  [
    {
      role: "system",
      content: "You are a personal assitant. You are helpful, creative, clever, and very friendly.",
    },
    {
      role: "user",
      content: userInput
    }
  ]); 
  return aiMessage.content;
}




