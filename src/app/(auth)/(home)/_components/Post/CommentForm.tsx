"use client";

import Button from "@/components/core/Button";
import { TPost } from "@/fetchings/type";
import { useCreateComment } from "@/hooks/useCreateComment";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/SessionStore";

type Props = {
  post: TPost;
};

export default function CommentForm({ post }: Props) {
  const { session } = useSessionStore();

  const { execute, formRef, isExecuting, message, setMessage } =
    useCreateComment({
      post,
      session,
    });

  return (
    <form
      ref={formRef}
      action={execute}
      className="flex gap-4 border-b border-skin pb-2"
    >
      <input
        disabled={isExecuting}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        name="message"
        type="text"
        className="w-full flex-1 border-none bg-background px-0 text-sm placeholder:text-skin-muted focus:ring-0"
        placeholder="Add a comment..."
      />

      <Button
        className={cn(
          "inline-flex justify-center bg-background text-sm",
          !message && "hidden",
        )}
        type="submit"
        isLoading={isExecuting}
      >
        Submit
      </Button>
    </form>
  );
}
