import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Message } from "ai/react";

// export const runtime = "edge";

export async function POST(req: Request) {
  // console.log("Called api");

  try {
    const { messages, chatId } = await req.json();

    // console.log("Messages:", messages);

    // console.log("Chat ID:", chatId);
    // const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));

    // // Log retrieved chats
    // console.log("_chats:", _chats);
    if (_chats.length != 1) {
      return NextResponse.json({ Error: " Chat not found" }, { status: 404 });
    }
    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    // Log fileKey and lastMessage
    // console.log("File Key:", fileKey);
    // console.log("Last Message:", lastMessage);
    const context = await getContext(lastMessage.content, fileKey);
    // console.log("Context:", context);
    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
    };
    const response = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
      async onFinish({ text }) {
        try {
          // Save user message into the database
          await db.insert(_messages).values({
            chatId,
            content: lastMessage.content,
            role: "user",
          });
          // Save AI response into the database
          await db.insert(_messages).values({
            chatId,
            content: text,
            role: "system",
          });
        } catch (error) {
          console.error("Error saving chat:", error);
        }
      },

      // messages,
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
