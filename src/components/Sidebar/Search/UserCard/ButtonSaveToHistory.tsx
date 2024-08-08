import { actionSaveToSearchHistory } from "@/lib/next-safe-action/searchUser/actionSaveToSearchHistory";
import Link from "next/link";
import React from "react";

interface Props {
  userId: string;
  username: string;
}

export default function ButtonSaveToHistory({ userId, username }: Props) {
  const action = async () => {
    await actionSaveToSearchHistory({ searchId: userId });
  };
  return (
    <Link
      className="font-medium hover:underline"
      onClick={action}
      href={`/${username}`}
    >
      {username}
    </Link>
  );
}
