import ChatComponent from "@/components/ChatComponent";
import ChatSidebar from "@/components/ChatSidebar";
import PDFViewer from "@/components/PDFViewer";
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
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId)); // list of all chats
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Chat Sidebar */}
      <div className="flex-[2] max-w-xs h-full overflow-y-auto">
        <ChatSidebar chatId={parseInt(chatId)} chats={_chats} />
      </div>
      {/* PDF Viewer */}
      <div className="flex-[5] h-full p-4 overflow-y-auto">
        <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
      </div>
      {/* Chat Component */}
      <div className="flex-[3] h-full border-l-4 border-l-slate-200 overflow-y-auto">
        <ChatComponent chatId={parseInt(chatId)} />
      </div>
    </div>
  );
};

export default ChatPage;
