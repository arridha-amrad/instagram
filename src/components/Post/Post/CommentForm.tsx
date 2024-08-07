import MySpinner from "@/components/Spinner";
import { TPost } from "@/lib/drizzle/queries/type";
import { actionCreateComment } from "@/lib/next-safe-action/actionCreateComment";
import { actionCreateReply } from "@/lib/next-safe-action/actionCreateReply";
import { cn } from "@/lib/utils";
import usePostsStore from "@/stores/Posts";
import { useReplySetter } from "@/stores/ReplySetter";
import { useSessionStore } from "@/stores/Session";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  post: TPost;
};

const CommentForm = ({ post }: Props) => {
  const { session } = useSessionStore();
  const avatar = session?.user.image ?? null;
  const id = session?.user.id ?? "";
  const username = session?.user.username ?? "";

  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");
  const { theme } = useTheme();
  const { reply, setReply } = useReplySetter();
  const { addReply, addComment } = usePostsStore();

  const replyAction = actionCreateReply.bind(null, reply!.commentId);
  const commentAction = actionCreateComment.bind(null, post.id);

  const { execute: exeReply, isExecuting: isExeReply } = useAction(
    replyAction,
    {
      onError: () => {
        toast.error("Something went wrong", { theme });
      },
      onSuccess: ({ data }) => {
        if (!data) return;
        addReply(data.commentId, {
          ...data,
          isLiked: false,
          owner: {
            avatar,
            id,
            username,
          },
          sumLikes: 0,
        });
      },
    },
  );

  const { execute: exeComment, isExecuting: isExeComment } = useAction(
    commentAction,
    {
      onError: () => {
        toast.error("Something went wrong", { theme });
      },
      onSuccess: ({ data }) => {
        if (!data) return;
        addComment({
          ...data,
          isLiked: false,
          owner: {
            avatar,
            id,
            username,
          },
          replies: {
            data: [],
            page: 0,
            total: 0,
          },
          sumLikes: 0,
          sumReplies: 0,
          sumRepliesRemaining: 0,
        });
      },
    },
  );

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
        {isExeComment ||
          (isExeReply && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <MySpinner />
            </div>
          ))}
        <div className="flex-1 px-2">
          <fieldset disabled={false}>
            <input
              // onBlur={() => setFocusToCommentForm(false)}
              // ref={inputRef}
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
          {false ? <MySpinner /> : "Send"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
