import React, { memo } from "react";
import { Message } from "ai/react";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";

function extractCodeFromString(message: string) {
  if (message.includes("```")) {
    const blocks = message.split("```");
    return blocks;
  }
  return [message]; // If no code blocks, return the entire message as a single block
}

function isCodeBlock(str: string) {
  return (
    str.includes("=") ||
    str.includes(";") ||
    str.includes("=>") ||
    str.includes("<>") ||
    str.includes("[") ||
    str.includes("//") ||
    str.includes("|")
  );
}
type Props = {
  messages: Message[];
};

const MessageList = memo(({ messages }: Props) => {
  if (!messages) {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-2 px-4 ">
      {messages.map((message) => {
        const messageBlocks = extractCodeFromString(message.content);
        return (
          <div
            key={message.id}
            className={cn("flex ", {
              "justify-end pl-10": message.role === "user",
              "justify-start pr-10": message.role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 py-1 text-sm shadow-md ring-1 ring-gray-900/10 ",
                {
                  "bg-gradient-to-r from-sky-400 to-blue-500":
                    message.role === "user",
                }
              )}
            >
              {/* Render message blocks */}
              {messageBlocks.map((block, index) =>
                isCodeBlock(block) ? (
                  <SyntaxHighlighter
                    key={index}
                    style={materialLight}
                    language="typescript" // You can set this dynamically based on content
                  >
                    {block}
                  </SyntaxHighlighter>
                ) : (
                  <p key={index}>{block}</p>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});
export default MessageList;
