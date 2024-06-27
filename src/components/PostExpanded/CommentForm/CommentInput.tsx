import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import ButtonSubmitComment from "./ButtonSubmitComment";
import { useFormStatus } from "react-dom";
import MySpinner from "@/components/Spinner";
import { useReplySetter } from "@/stores/ReplySetter";

type Props = {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
};

const CommentInput = ({ message, setMessage }: Props) => {
  const { pending } = useFormStatus();
  const { commentTarget } = useReplySetter();

  useEffect(() => {
    if (commentTarget?.commentId) {
      ref.current?.focus();
      setMessage(`@${commentTarget?.username} `);
    }
  }, [commentTarget?.commentId]);

  const ref = useRef<HTMLInputElement | null>(null);
  const { setFocusToCommentForm, isFocusToCommentForm } = useReplySetter();

  useEffect(() => {
    if (isFocusToCommentForm) {
      ref.current?.focus();
    }
  }, [isFocusToCommentForm]);

  return (
    <div className="relative flex h-full w-full items-center">
      {pending && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <MySpinner />
        </div>
      )}
      <div className="flex-1 px-2">
        <fieldset disabled={pending}>
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
      <ButtonSubmitComment message={message} />
    </div>
  );
};

export default CommentInput;
