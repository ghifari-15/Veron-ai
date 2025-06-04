import { ChatOpenAI } from "@langchain/openai";
import { config } from "dotenv";
import { ChatVertexAI } from "@langchain/google-vertexai";

// Load environment variables from .env file
config();



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
   projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
   location: process.env.GOOGLE_CLOUD_LOCATION,
   maxTokens: 1000000,
  },
  {
   id: "rakuten/rakutenai-7b-chat",
   name: "Rakutenai 7b",
   description: "Advanced state-of-the-art LLM with language understanding, superior reasoning, and text generation.",
   provider: "nvidia",
   apiKey: process.env.NVIDIA_API_KEY,
   maxTokens: 1024,
   baseURL: "https://integrate.api.nvidia.com/v1"
  }

]

// Filter available models based on API keys and credentials
export const getAvailableModels = () => {
  return availableModels.filter(model => {
    if (model.provider === "dashscope") {
      if (!model.apiKey || model.apiKey === "") {
        console.warn(`Dashscope API key for model ${model.name} is not set.`);
        return false;
      }
    } else if (model.provider === "google-genai") {
      if (!model.projectId) {
        console.warn(`Google Cloud Project ID not found for ${model.name}`);
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
  if (modelConfig.provider === "dashscope") {
    if (!modelConfig.apiKey) {
    throw new Error('Model' + modelId + ' does not have a valid API key');
  }
  return new ChatOpenAI({
    model: modelConfig.id,
    apiKey: modelConfig.apiKey,
    temperature: 0.7,
    configuration: {
      baseURL: modelConfig.baseURL
    }
  });
  } else if (modelConfig.provider === "google-genai") {
    if (!modelConfig.projectId) {
      throw new Error(`Project ID not configured for ${modelConfig.name}`);
    }
    return new ChatVertexAI({
      model: modelConfig.id,
      apiKey: modelConfig.apiKey,
      temperature: 0.7,
      maxOutputTokens: Math.min(modelConfig.maxTokens || 8192, 8192), // Default to 8192 if not specified
      location: modelConfig.location,
    });
    
  } else if (modelConfig.provider === "nvidia") {
    if(!modelConfig.apiKey) {
      throw new Error(`API key not configured for ${modelConfig.name}`);
    }
    return new ChatOpenAI({
      model: modelConfig.id,
      apiKey: modelConfig.apiKey,
      temperature: 0.5,
      topP: 1,
      maxTokens: modelConfig.maxTokens,
      streaming: false,
      configuration: {
        baseURL: modelConfig.baseURL,
      }
    })
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
    return null;
  }
  const dashscopeModel = available.find(model => model.provider === "dashscope");
  return dashscopeModel ? dashscopeModel.id : available[0].id;
}

export default createModelFromConfig;











 



