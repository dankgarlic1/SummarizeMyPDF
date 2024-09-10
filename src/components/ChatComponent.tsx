"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";

type Props = {};

const ChatComponent = (props: Props) => {
  const { input, handleInputChange, handleSubmit, messages } = useChat();
  return (
    <div className="relative max-h-screen overflow-scroll">
      {/* Header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>
      {/* Message List */}
      <form
        onSubmit={handleSubmit}
        className="sticky  bottom-0 px-2 py-4 inset-x-0 bg-white"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="As any question..."
          className="w-full"
        />
        <Button className="bg-gradient-to-r from-sky-400 to-blue-500 ml-2">
          <SendIcon className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;
