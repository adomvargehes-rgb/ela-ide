import { NextRequest, NextResponse } from "next/server";
import { routeAIRequest, AICompletionRequest } from "@/lib/ai/router";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body: AICompletionRequest = await req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Invalid request: 'messages' array is required." },
        { status: 400 }
      );
    }

    // Securely inject server-side API secrets if not provided by client BYOK
    if (body.providers) {
      if (!body.providers.gemini?.apiKey && process.env.GEMINI_API_KEY) {
        body.providers.gemini = {
          ...body.providers.gemini,
          apiKey: process.env.GEMINI_API_KEY,
        };
      }
      if (!body.providers.groq?.apiKey && process.env.GROQ_API_KEY) {
        body.providers.groq = {
          ...body.providers.groq,
          apiKey: process.env.GROQ_API_KEY,
        };
      }
      if (!body.providers.openrouter?.apiKey && process.env.OPENROUTER_API_KEY) {
        body.providers.openrouter = {
          ...body.providers.openrouter,
          apiKey: process.env.OPENROUTER_API_KEY,
        };
      }
      if (!body.providers.deepseek?.apiKey && process.env.DEEPSEEK_API_KEY) {
        body.providers.deepseek = {
          ...body.providers.deepseek,
          apiKey: process.env.DEEPSEEK_API_KEY,
        };
      }
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

