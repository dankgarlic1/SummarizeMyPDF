import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* centers everything  */}
        <div className="flex flex-col items-center text-center">
          <div className="items-center flex">
            <h1 className="text-5xl font-semibold mr-3">Chat with any PDF</h1>
            <UserButton />
          </div>
          <div className="flex mt-4 gap-2">
            {isAuth && <Button>Go to Chats</Button>}
            <Button className="bg-white text-black">Manage Subscription</Button>
          </div>
          <p className="max-w-xl mt- text-lg text-slate-600">
            Join millions of students, researchers, and professionals to
            instantly answer questions and understand research with AI
          </p>
          <div className="w-full mt-4">
            {isAuth ? (
              // <h1>Drag pdf</h1>
              <FileUpload />
            ) : (
              <Link href={"/sign-in"}>
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
