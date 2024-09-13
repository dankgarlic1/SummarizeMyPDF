import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* centers everything  */}
        <div className="flex flex-col items-center text-center">
          <div className="items-center flex">
            <h1 className="text-5xl font-semibold mr-3">Chat with any PDF</h1>
            <UserButton />
          </div>
          <div className="flex mt-2">
            {isAuth && firstChat && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Go to Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <div className="ml-3">
                  {/* <SubscriptionButton isPro={isPro} /> */}
                </div>
              </>
            )}
          </div>
          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Ready to flirt with PDFs? Join millions of students, researchers,
            and professionals who are using AI to unlock answers, dive deep into
            research, and turn those boring documents into charming
            conversations. 💌📚 Get ready to make your PDFs blush!
          </p>
          <p className="max-w-xl mt-2 text-sm text-slate-500">
            *Disclaimer: Due to our limited resources, you can only charm up to
            2 PDFs per day😉
          </p>
          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href={"/sign-in"}>
                <Button>
                  Login to get Started! <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
