import { Icons } from "@/components/ui/icons";
import React from "react";

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-fadeInOut">
        <Icons.Main className="w-12 h-12" />
      </div>
    </div>
  );
}

export default Loading;
