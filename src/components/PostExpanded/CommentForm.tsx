import MySpinner from "@/components/Spinner";
import { TPost } from "@/fetchings/type";
import { useCreateComment } from "@/hooks/useCreateComment";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/SessionStore";

type Props = {
  post: TPost;
};

const CommentForm = ({ post }: Props) => {
  const { session } = useSessionStore();
  const {
    execute,
    formRef,
    inputRef,
    isExecuting,
    message,
    setFocusToCommentForm,
    setMessage,
  } = useCreateComment({
    post,
    session,
  });

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
              ref={inputRef}
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
