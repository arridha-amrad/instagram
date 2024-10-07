import MySpinner from "@/components/Spinner";
import { useActionCreateComment } from "@/hooks/useActionCreateComment";
import { useActionCreateReply } from "@/hooks/useActionCreateReply";
import { TPost } from "@/lib/drizzle/queries/fetchPost";
import { cn } from "@/lib/utils";
import { useReplySetter } from "@/stores/ReplySetter";
import mergeRefs from "merge-refs";
import { forwardRef, Ref, useEffect, useRef, useState } from "react";

type Props = {
  post: TPost;
};

const CommentForm = ({ post }: Props, ref: Ref<HTMLInputElement>) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");
  const { reply, setReply } = useReplySetter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (reply?.commentId) {
      setMessage(`@${reply.username} `);
      inputRef.current?.focus();
    }
  }, [reply?.commentId]);

  const {
    execute: exeReply,
    hasSucceeded: isSuccessCreateReply,
    isExecuting: isExeReply,
  } = useActionCreateReply(reply?.commentId ?? "");

  const {
    exeComment,
    isExeComment,
    isSuccess: isSuccessCreateComment,
  } = useActionCreateComment(post.id);

  useEffect(() => {
    if (isSuccessCreateComment || isSuccessCreateReply) {
      formRef.current?.reset();
      setMessage("");
    }
  }, [isSuccessCreateComment, isSuccessCreateReply]);

  useEffect(() => {
    if (message === "") {
      setReply(null);
    }
  }, [message]);

  return (
    <form
      ref={formRef}
      action={reply ? exeReply : exeComment}
      className="flex h-full items-center pt-1"
    >
      <div className="relative flex h-full w-full items-center">
        {(isExeComment || isExeReply) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <MySpinner />
          </div>
        )}
        <div className="flex-1 px-2">
          <fieldset disabled={isExeReply || isExeComment}>
            <input
              ref={mergeRefs(ref, inputRef)}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              name="message"
              type="text"
              placeholder="Add comment..."
              className="h-12 w-full flex-1 rounded-md border-none bg-background px-4 text-sm focus:ring-2 focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
            />
          </fieldset>
        </div>
        <button
          disabled={isExeReply || isExeComment || message.length === 0}
          type="submit"
          className={cn(
            "h-full bg-background px-2 text-sm",
            message.length > 0
              ? "font-semibold text-skin-inverted"
              : "text-skin-muted/50",
          )}
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default forwardRef(CommentForm);
