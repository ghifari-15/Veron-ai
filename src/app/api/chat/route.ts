import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/lib/chatbot-library";
import { error, timeStamp } from "console";

export async function POST(request: NextRequest) {
    try {
        const { message, modelId } = await request.json();
        if (!message || typeof message !== "string" || message.trim() === '') {
            return NextResponse.json(
                { error: "Message is required and must be a non-empty string" },
                { status: 400 }
            );
        }
        if (!modelId) {
            return NextResponse.json(
                { error: "Model ID is required" },
                { status: 400 }
            );
        }
        console.log("API: Received request for model:", modelId);
        console.log("API: Message content:", message.substring(0, 100) + "...");
        console.log("API: Environment check - GROQ_API_KEY:", !!process.env.GROQ_API_KEY);
        console.log("API: Environment check - OPEN_ROUTER_API_KEY:", !!process.env.OPEN_ROUTER_API_KEY);

        // Call the sendMessage function with the provided message and modelId
        const response = await sendMessage(message.trim(), modelId);


        return NextResponse.json({
            response,
            modelId,
            timeStamp: new Date().toISOString()
        }
        );

    } catch (err) {
        console.error("Error in chat API:", err);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error occured" },
            { status: 500 }
        );
    }
}