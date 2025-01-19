"use client";

import { removeAllSearchHistories } from "@/lib/actions/user";
import { usePathname } from "next/navigation";
import React from "react";

export default function ButtonRemoveAll() {
  const pathname = usePathname();
  const removeAll = async () => {
    await removeAllSearchHistories.bind(null, pathname)();
  };
  return (
    <button onClick={removeAll} type="submit" className="font-semibold">
      Clear all
    </button>
  );
}
