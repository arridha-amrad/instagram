import Spinner from "@/components/Spinner";
import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/50 backdrop-blur-0" />
      <div className="relative bg-background p-6">
        <Spinner />
      </div>
    </div>
  );
}
