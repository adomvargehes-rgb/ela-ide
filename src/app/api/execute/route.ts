import { NextRequest, NextResponse } from "next/server";
import { executeCode } from "@/lib/execution/runner";

export async function POST(req: NextRequest) {
  try {
    const { language, code, files } = await req.json();

    if (!code && code !== "") {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const result = await executeCode(language || "javascript", code, files || {});
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Execution failed" },
      { status: 500 }
    );
  }
}

