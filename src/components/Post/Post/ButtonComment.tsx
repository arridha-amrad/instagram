"use client";

import React from "react";
import ChatBubbleOvalLeftIcon from "@heroicons/react/24/outline/ChatBubbleOvalLeftIcon";

export default function ButtonComment() {
  return (
    <button>
      <ChatBubbleOvalLeftIcon className="aspect-square w-7 -scale-x-100" />
    </button>
  );
}
