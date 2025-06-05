import { ChatOpenAI } from "@langchain/openai";
import { config } from "dotenv";
import { ChatVertexAI } from "@langchain/google-vertexai";

// Load environment variables from .env file
config();



export const availableModels = [
  {
    id: "qwen/qwen3-8b:free",
    name: "Qwen 3 8B",
    description: "Qwen 3 8B is a large language model with 8 billion parameters, designed for advanced natural language understanding and generation tasks.",
    provider: "aliyun",
    source: "openrouter",
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  },
  {
    id: "qwen/qwen3-14b:free",
    name: "Qwen 3-14B",
    description: "Qwen 3-14B is a large language model with 14 billion parameters, designed for advanced natural language understanding and generation tasks.",
    provider: "aliyun",
    source: "openrouter",
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  },
  {
    id: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
    name: "Llama 3.1 Nemotron Ultra 253B",
    description: "Llama 3.1 Nemotron Ultra 253B is a state-of-the-art language model with 253 billion parameters, designed for advanced natural language understanding and generation tasks.",
    provider: "nvidia",
    source: "openrouter",
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  },
  {
    id: "microsoft/phi-4-reasoning-plus:free",
    name: "Gemma 3N E4B IT",
    description: "Gemma 3N E4B IT is a powerful language model designed for advanced natural language understanding and generation tasks, with a focus on IT-related queries.",
    provider: "google",
    source: "openrouter",
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  },
  
]

// Filter available models based on API keys and credentials
export const getAvailableModels = () => {
  return availableModels.filter(model => {
    if (model.source === "openrouter") {
      if (!model.apiKey || model.apiKey === "") {
        console.warn(`OpenRouter API key for model ${model.name} is not set.`);
        return false;
      }
    }
    return true;
  });
};

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
  // Support openrouter and nvidia (since both use OpenRouter API)
  if (modelConfig.provider === "openrouter" || modelConfig.source === "openrouter" || modelConfig.provider === "nvidia") {
    if (!modelConfig.apiKey) {
      throw new Error('Model ' + modelId + ' does not have a valid API key');
    }
    return new ChatOpenAI({
      model: modelConfig.id,
      apiKey: modelConfig.apiKey,
      temperature: 0.7,
      configuration: {
        baseURL: modelConfig.baseURL,
      }
    });
  }
  throw new Error(`Provider ${modelConfig.provider} not supported for model ${modelId}`);
}

// Main function to send message 
export async function sendMessage(userInput: string, modelId: string) {
  const model = createModelFromConfig(modelId);
  const modelConfig = getModelById(modelId);
  if(!model) {
    throw new Error(`Model ${modelId} could not be initialized`);
  }
  console.log('Using model: ', modelConfig?.name);

  const aiMessage = await model.invoke([
    {
      role: "system",
      content: "You are Veron AI, a professional personal assistant. You are helpful, creative, clever, and very friendly. Please respond in a friendly and helpful manner.",
    },
    {
      role: "user",
      content: userInput
    }
  ]);
  return aiMessage.content;
}

export const getDefaultModel = () => {
  const available = getAvailableModels();
  if (available.length === 0){
    throw new Error("No available models found. Please check your API configuration.");
  }
  // Prefer openrouter, fallback to first
  const openrouterModel = available.find(model => model.provider === "openrouter" || model.source === "openrouter");
  return openrouterModel ? openrouterModel.id : available[0].id;
}

export default createModelFromConfig;















