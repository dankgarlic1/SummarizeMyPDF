import ChatSidebar from "@/components/ChatSidebar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId)); //list of all chats
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }
  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex overflow-scroll max-h-screen w-full">
        {/* Chat Sidebar */}
        <div className="flex-[1] max-w-xs ">
          <ChatSidebar />
        </div>
        {/* PDF Viewer */}
        <div className="flex-[5] max-h-screen p-4 overflow-scroll">
          hhhhhhpjo
          {/* <PDFViewer/> */}
        </div>
        {/* Chat Component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          jsjsjsjsj
          {/* <ChatComponent/> */}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
