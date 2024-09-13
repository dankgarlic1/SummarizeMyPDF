"use client";
import React, { memo } from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Loader2, SendIcon } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Props = { chatId: number };

const ChatComponent = memo(({ chatId }: Props) => {
  // console.log("Chat ID in ChatComponent:", chatId);
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post("/api/get-messages", { chatId });
      return response.data;
    },
    staleTime: 300000, // 5 minutes of cache life
    // cacheTime: 900000,  // 15 minutes to persist the cache

    refetchOnWindowFocus: false, // Disable refetching when the window is focused
  });
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",

    body: {
      chatId,
    },
    initialMessages: data || [],
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

      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      ) : (
        <MessageList messages={messages} />
      )}
      <form
        onSubmit={handleSubmit}
        className="sticky  bottom-0 px-2 py-4 inset-x-0 bg-white mt-2"
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
});
// ChatComponent.displayName = "ChatComponent";

export default ChatComponent;
