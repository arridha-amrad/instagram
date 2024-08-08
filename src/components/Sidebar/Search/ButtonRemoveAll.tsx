"use client";

import { actionRemoveAllSearchHistories } from "@/lib/next-safe-action/searchUser/actionRemoveAllSearchHistories";
import React from "react";

export default function ButtonRemoveAll() {
  const removeAll = async () => {
    await actionRemoveAllSearchHistories();
  };
  return (
    <button onClick={removeAll} type="submit" className="font-semibold">
      Clear all
    </button>
  );
}
