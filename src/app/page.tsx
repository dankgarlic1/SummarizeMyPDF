import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* center everything  */}
        <div className="flex flex-col items-center text-center">
          <div className="items-center flex">
            <h1 className="text-5xl font-semibold">Chat with any PDF</h1>
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
}
