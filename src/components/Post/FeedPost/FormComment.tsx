"use client";

import Spinner from "@/components/Spinner";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { actionCreateComment } from "@/lib/next-safe-action/actionCreateComment";
import { useFeedPosts } from "@/stores/useFeedPosts";

type Props = {
  postId: string;
};

export default function CommentForm({ postId }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");
  const { theme } = useTheme();

  const { addComment } = useFeedPosts();

  const action = actionCreateComment.bind(null, postId);
  const { execute, isExecuting } = useAction(action, {
    onError: () => {
      toast.error("Something went wrong", { theme });
    },
    onSuccess: ({ data }) => {
      if (data) {
        console.log(data);
        addComment({
          body: data.message,
          id: data.id,
          isLiked: false,
          postId: data.postId,
          username: data.username,
        });
      }
      formRef.current?.reset();
      setMessage("");
    },
  });

  return (
    <form action={execute} className="relative" ref={formRef}>
      {isExecuting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/70">
          <Spinner />
        </div>
      )}
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
        <button
          disabled={!message}
          className={cn(
            "p-1 text-sm",
            !message ? "text-skin-muted" : "text-skin-inverted",
          )}
          type="submit"
        >
          Post
        </button>
      </fieldset>
    </form>
  );
}
