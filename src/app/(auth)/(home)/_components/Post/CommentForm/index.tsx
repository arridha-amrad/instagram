"use client";

import Spinner from "@/components/Spinner";
import { TFeedComment, TFeedPost } from "@/lib/drizzle/queries/type";
import { cn } from "@/lib/utils";
import usePostsStore from "@/stores/Posts";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { action } from "./action";
import { useSessionStore } from "@/stores/Session";

type Props = {
  post: TFeedPost;
};

export default function CommentForm({ post }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");
  const { theme } = useTheme();
  const { session } = useSessionStore();
  const { addCommentToFeedPost } = usePostsStore();

  const newCommentAction = action.bind(null, post.id);
  const { execute, isExecuting } = useAction(newCommentAction, {
    onError: () => {
      toast.error("Something went wrong", { theme });
    },
    onSuccess: ({ data }) => {
      if (data) {
        const newComment: TFeedComment = {
          ...data,
          isLiked: false,
          username: session?.user.username ?? "",
        };
        addCommentToFeedPost(newComment);
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
