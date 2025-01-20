"use client";

import Spinner from "@/components/Spinner";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { create } from "@/lib/actions/comment";
import { useFeedPosts } from "@/app/(auth)/(home)/Post/store";
import { usePathname } from "next/navigation";

type Props = {
  postId: string;
};

export default function FormComment({ postId }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");
  const { theme } = useTheme();
  const pathname = usePathname();

  const { addComment } = useFeedPosts();

  const action = create.bind(null, postId, pathname);
  const { execute, isPending } = useAction(action, {
    onError: () => {
      toast.error("Something went wrong", { theme });
    },
    onSuccess: ({ data }) => {
      if (data) {
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
    <fieldset className="relative" disabled={false}>
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/70">
          <Spinner />
        </div>
      )}
      <form
        action={execute}
        className="relative flex gap-4 border-b border-skin"
        ref={formRef}
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
      </form>
    </fieldset>
  );
}
