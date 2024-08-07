"use client";

import { useReplySetter } from "@/stores/ReplySetter";
import React from "react";

type Props = {
  commentId: string;
  username: string;
};

export default function ButtonReply({ commentId, username }: Props) {
  const { setReply } = useReplySetter();
  return (
    <button
      onClick={() =>
        setReply({
          commentId,
          username,
        })
      }
    >
      Reply
    </button>
  );
}
