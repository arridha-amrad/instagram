"use client";

import { actionRemoveSearchHistory } from "@/lib/next-safe-action/searchUser/actionRemoveSearchHistory";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

interface Props {
  userId: string;
}

export default function ButtonRemove({ userId }: Props) {
  const remove = async () => {
    await actionRemoveSearchHistory({ searchId: userId });
  };
  return (
    <button onClick={remove} type="submit" className="flex-none">
      <XMarkIcon className="aspect-square w-5" />
    </button>
  );
}
