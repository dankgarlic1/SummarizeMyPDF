import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const response = await streamText({
      model: openai("gpt-4o-mini"),
      messages,
    });
    return response.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
