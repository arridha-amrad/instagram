"use client";

import Button from "@/components/core/Button";
import { TPost } from "@/fetchings/type";
import { useCreateComment } from "@/hooks/useCreateComment";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/lib/zustand/sessionStore";
import { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import ButtonEmoji from "./ButtonEmoji";

type Props = {
  post: TPost;
};

export default function CommentForm({ post }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");

  // const { execute, formRef, isExecuting, message, setMessage } =
  //   useCreateComment({
  //     post,
  //     session,
  //   });

  return (
    <form ref={formRef}>
      <fieldset
        className="relative flex gap-4 border-b border-skin"
        disabled={false}
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          name="message"
          type="text"
          className="w-full flex-1 border-none bg-background px-0 text-sm placeholder:text-skin-muted focus:ring-0"
          placeholder="Add a comment..."
        />

        {!!message && (
          <button
            className={cn(
              "p-1 text-sm",
              !message ? "text-skin-muted" : "text-skin-inverted",
            )}
            type="submit"
          >
            Post
          </button>
        )}
        <ButtonEmoji />
      </fieldset>
    </form>
  );
}
