"use client";

import { commentAction } from "@/actions/commentAction";
import Button from "@/components/core/Button";
import { TCommentSchema, TPost } from "@/fetchings/type";
import setNewCommentOnClient from "@/helpers/setNewCommentOnClient";
import { cn } from "@/lib/utils";
import { usePostStore } from "@/stores/PostStore";
import { useSessionStore } from "@/stores/SessionStore";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  post: TPost;
};

const CommentForm = ({ post }: Props) => {
  const { session } = useSessionStore();
  const { theme } = useTheme();
  const ca = commentAction.bind(null, null, post.id, session?.user.id ?? "");
  const { execute, result, isExecuting, hasErrored, hasSucceeded } = useAction(ca);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");
  const { addComment } = usePostStore();

  useEffect(() => {
    if (hasSucceeded && session?.user) {
      if (result.data?.msgComment) {
        setMessage("");
        formRef.current?.reset();
        const newComment = result.data.data as TCommentSchema;
        setNewCommentOnClient({
          authUser: session.user,
          comment: newComment,
          setterFn: addComment,
        });
      }
      if (result.data?.err) {
        toast.error(result.data.err, { theme });
      }
    }
  }, [hasSucceeded]);

  useEffect(() => {
    if (hasErrored) {
      toast.error("Something went wrong", { theme });
    }
  }, [hasErrored]);

  return (
    <form ref={formRef} action={execute} className="flex gap-4 border-b border-skin pb-2">
      <input
        disabled={isExecuting}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        name="message"
        type="text"
        className="w-full flex-1 border-none bg-background px-0 text-sm placeholder:text-skin-muted focus:ring-0"
        placeholder="Add a comment..."
      />

      <Button className={cn("inline-flex justify-center", !message && "hidden")} type="submit" isLoading={isExecuting}>
        Submit
      </Button>
    </form>
  );
};

export default CommentForm;
