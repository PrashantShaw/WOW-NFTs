import { Image as ImageIcon } from "lucide-react";
import React from "react";

const NFTCardSkeleton = () => {
  return (
    <div className="animate-pulse shadow bg-gray-50/80 dark:bg-gray-900 overflow-hidden rounded-lg aspect-[3/4] flex flex-col">
      <div className="flex-grow overflow-hidden flex">
        <div className="flex-1 object-cover border-b grid place-items-center">
          <ImageIcon className="w-40 h-40 text-secondary" />
        </div>
      </div>
      <div className="p-3">
        <div className="h-4 w-36 rounded-md bg-secondary" />
        <div className="h-6 w-28 mt-4 rounded-md bg-secondary" />
        <div className="h-3 w-44 mt-2 rounded-md bg-secondary" />
      </div>
    </div>
  );
};

export default NFTCardSkeleton;
