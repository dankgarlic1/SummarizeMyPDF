"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";
import MessageList from "./MessageList";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  // console.log("Chat ID in ChatComponent:", chatId);

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",

    body: {
      chatId,
    },
  });
  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="relative max-h-screen overflow-scroll"
      id="message-container"
    >
      {/* Header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>
      {/* Message List */}
      <MessageList messages={messages} />
      <form
        onSubmit={handleSubmit}
        className="sticky  bottom-0 px-2 py-4 inset-x-0 bg-white"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="bg-gradient-to-r from-sky-400 to-blue-500 ml-2">
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
