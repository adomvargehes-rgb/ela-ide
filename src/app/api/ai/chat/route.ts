import { NextRequest, NextResponse } from "next/server";
import { routeAIRequest, AICompletionRequest } from "@/lib/ai/router";

export async function POST(req: NextRequest) {
  try {
    const body: AICompletionRequest = await req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Invalid request: 'messages' array is required." },
        { status: 400 }
      );
    }

    const response = await routeAIRequest(body);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("AI API route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process AI request" },
      { status: 500 }
    );
  }
}
