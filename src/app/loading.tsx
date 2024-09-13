import { Loader2 } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex justify-center items-center h-full">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
    </div>
  );
}
