"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const FileUpload = () => {
  const router = useRouter();

  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [lastUploadDate, setLastUploadDate] = useState<Date | null>(null);

  useEffect(() => {
    // if (!userId) return;
    const storedCount = localStorage.getItem("uploadCount");
    const storedDate = localStorage.getItem("lastUploadDate");
    const now = new Date();

    if (storedDate) {
      const lastDate = new Date(storedDate);
      if (now.getTime() - lastDate.getTime() > 24 * 60 * 60 * 1000) {
        // Reset count if more than 24 hours have passed
        localStorage.setItem("uploadCount", "0");
        localStorage.setItem("lastUploadDate", now.toISOString());
        setUploadCount(0);
        setLastUploadDate(now);
      } else {
        // Use stored count and date
        setUploadCount(parseInt(storedCount as string, 10) || 0);
        setLastUploadDate(lastDate);
        console.log(lastUploadDate);
      }
    } else {
      // Initialize for the first time
      localStorage.setItem("uploadCount", "0");
      localStorage.setItem("lastUploadDate", now.toISOString());
      setUploadCount(0);
      setLastUploadDate(now);
    }
  }, [lastUploadDate]);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      console.log("API response:", response.data);
      return response.data;
    },
  });
  const { getInputProps, getRootProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        //bigger than 10mb
        toast("File too large");
        return;
      }
      if (uploadCount >= 2) {
        // Check if the user has reached the limit
        toast("Daily PDF limit exceeded. Please try again tomorrow.");
        return;
      }
      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data?.file_name) {
          toast.error("Something went wrong");
          return;
        }
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        console.log(`user email: ${userEmail}`);

        const isSpecialUser = userEmail === "raizadaharshit2004@gmail.com";
        if (!isSpecialUser && uploadCount >= 2) {
          // Check if the user has reached the limit
          toast("Daily PDF limit exceeded. Please try again tomorrow.");
          return;
        }
        // Increment upload count
        // Increment upload count for non-special users
        if (!isSpecialUser) {
          const newCount = uploadCount + 1;
          localStorage.setItem("uploadCount", newCount.toString());
          setUploadCount(newCount);
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created Successfully");
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            toast.error("Error creating chat");

            console.log(err);
          },
        });
        console.log("data: ", data);
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col"
      >
        <input {...getInputProps()} />
        {uploading || isPending ? (
          <>
            {/* Loading state */}
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling tea to GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
