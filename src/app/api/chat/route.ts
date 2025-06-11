import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/lib/chatbot-library";
import { error } from "console";

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
                {error: "Model ID is required"},
                { status: 400 }
            );
        }
        console.log("API: Received request for model:", modelId);
        console.log("API: Message content:", message.substring(0, 100) + "...");

        // Call the sendMessage function with the provided message and modelId
        const response = await sendMessage(message, modelId);


        return NextResponse.json(response);
        
    } catch (err) {
        console.error("Error in chat API:", err);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error occured" },
            { status: 500 }
        );
    }
}