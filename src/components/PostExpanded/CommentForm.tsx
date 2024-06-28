import { commentAction } from "@/actions/commentAction";
import MySpinner from "@/components/Spinner";
import { TCommentSchema, TPost, TReplySchema } from "@/fetchings/type";
import setNewCommentOnClient from "@/helpers/setNewCommentOnClient";
import setNewReplyOnClient from "@/helpers/setNewReplyOnClient";
import { cn } from "@/lib/utils";
import { useCommentsStore } from "@/stores/CommentsStore";
import { useReplySetter } from "@/stores/ReplySetter";
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
  const { setFocusToCommentForm, isFocusToCommentForm, commentTarget, id } =
    useReplySetter();
  const { theme } = useTheme();
  const { addComment, addReply } = useCommentsStore();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");
  const [replyState, setReplyState] = useState({
    userId: "",
    commentId: "",
  });

  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isFocusToCommentForm) {
      ref.current?.focus();
    }
  }, [isFocusToCommentForm]);

  useEffect(() => {
    if (commentTarget) {
      setReplyState({
        commentId: commentTarget.commentId,
        userId: commentTarget.userId,
      });
      ref.current?.focus();
      setMessage(`@${commentTarget.username} `);
    }
  }, [id]);

  useEffect(() => {
    if (message === "") {
      setReplyState({
        commentId: "",
        userId: "",
      });
    }
  }, [message]);

  const ca = commentAction.bind(
    null,
    replyState.commentId,
    post.id,
    session?.user.id ?? "",
  );
  const { execute, isExecuting, result, hasSucceeded, hasErrored } =
    useAction(ca);

  useEffect(() => {
    if (hasErrored) {
      toast.error("Something went wrong", { theme });
    }
  }, [hasErrored]);

  useEffect(() => {
    if (hasSucceeded && session?.user) {
      if (result.data?.msgComment) {
        setNewCommentOnClient({
          authUser: session.user,
          comment: result.data.data as TCommentSchema,
          setterFn: addComment,
        });
      }
      if (result.data?.msgReply) {
        setNewReplyOnClient({
          authUser: session.user,
          reply: result.data.data as TReplySchema,
          setterFn: addReply,
        });
      }
      setMessage("");
      formRef.current?.reset();
    }
    if (result.data?.err) {
      toast.error(result.data.err, { theme });
    }
  }, [hasSucceeded]);

  return (
    <form
      ref={formRef}
      action={execute}
      className="flex h-full items-center pt-1"
    >
      <div className="relative flex h-full w-full items-center">
        {isExecuting && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <MySpinner />
          </div>
        )}
        <div className="flex-1 px-2">
          <fieldset disabled={isExecuting}>
            <input
              onBlur={() => setFocusToCommentForm(false)}
              ref={ref}
              value={message}
              name="message"
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Add comment..."
              className="h-12 w-full flex-1 rounded-md border-none bg-background px-4 text-sm focus:ring-2 focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
            />
          </fieldset>
        </div>
        <button
          disabled={isExecuting || message.length === 0}
          type="submit"
          className={cn(
            "h-full bg-background px-2 text-sm",
            message.length > 0
              ? "font-semibold text-skin-inverted"
              : "text-skin-muted/50",
          )}
        >
          {isExecuting ? <MySpinner /> : "Send"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
