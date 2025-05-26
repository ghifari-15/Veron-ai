import { ChatOpenAI } from "@langchain/openai";
import { config } from "dotenv";

config();
const apiKey = process.env.DASHSCOPE_API_KEY;



const model = new ChatOpenAI({
    model: "qwen-turbo",
  
    apiKey: apiKey,
    temperature: 0.7,
    configuration: {
      baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    }
  });



export default model;
