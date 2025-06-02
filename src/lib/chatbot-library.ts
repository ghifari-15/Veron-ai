import { ChatOpenAI } from "@langchain/openai";
import { config } from "dotenv";
import { get } from "http";

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
   id: "gemini-1.5-pro",
   name: "Gemini 1.4 Pro",
   description: "Google's most capable multimodal model with 1M token context",
   provider: "vertexai",
   projectId: process.env.GOOG
  },

]

// Filter available models based on API keys
export const getAvailableModels = () => {
  return availableModels.filter(model => {
    if (model.provider === "dashscope") {
      if(!model.apiKey || model.apiKey === "") {
        console.error(`Dashscope API key for model ${model.name} is not set.`); 
        return false;
      }
    } else if(model.provider === "vertexai") {
      if (!model.projectId) {
        console.warn(`Google Cloud Project ID not found for ${model.name}`)
        return false;
      }
      }
      
    }

    // Check for credentials
    
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
}

// Main function to send message 
export async function sendMessage(userInput: string, modelId: string) {
  const model = createModelFromConfig(modelId);
  const modelConfig = getModelById(modelId);
  if(!model) {
    throw new Error('Model' + model + ' is not available');
  }
  console.log('Using model: ', modelConfig?.name);
  const aiMessage = await model.invoke([
    {
      role: "system",
      content: "You are a professional personal assistance. Your name is Veron AI. You are here to help the user with their questions and tasks. Please respond in a friendly and helpful manner.",
    },
    {
      role: "user",
      content: userInput
    }
  ]);
  return aiMessage;
}

export const getDefaultModel = () => {
  const available = getAvailableModels();
  return available.length > 0 ? available[0].id : null;
}

export default createModelFromConfig;











 



