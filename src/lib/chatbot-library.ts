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


// Get model by ID
export const getModelById = (modelId: string) => {
  return availableModels.find(model => model.id === modelId);
}

// Create model instance from array configuration
export function createModelFromConfig(modelId: string) {
  const modelConfig = getModelById(modelId);
  if (!modelConfig) {
    throw new Error(`Model "${modelId}" not found in available models`);
  } 
  if (!modelConfig.apiKey) {
    throw new Error('Model' + modelId + ' does not have a valid API key');
  }


  const commonConfig = {
    model: modelConfig.id,
    apiKey: modelConfig.apiKey,
    temperature: 0.7,
    provider: modelConfig.provider,
  };
  
  if (modelConfig.provider === "dashscope") {
    return new ChatOpenAI({
      ...commonConfig,
      configuration: {
        baseURL: modelConfig.baseURL
      }
    });
}

// Main function to send message 
export async function sendMessage(userInput: string, modelId: string) {
  const model = createModelFromConfig(modelId);
  const modelConfig = getModelById(modelId);


  const aiMessage = await model?.invoke([
    {
      role: "system",
      content: "You are a personal assistant. You are helpful, creative, clever, and very friendly.",
    },
    {
      role: "user",
      content: userInput
    }
  ])
}
















const model = new ChatOpenAI({
    model: "qwen-turbo",
    apiKey: apiKey,
    temperature: 0.7,
    configuration: {
      baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    }
  });
 
// export async function sendMessage(userInput: string) {
//   const aiMessage = await model.invoke(
//   [
//     {
//       role: "system",
//       content: "You are a personal assitant. You are helpful, creative, clever, and very friendly.",
//     },
//     {
//       role: "user",
//       content: userInput
//     }
//   ]); 
//   return aiMessage.content;
// }




