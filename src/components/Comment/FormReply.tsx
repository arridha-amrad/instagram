import { useActionCreateReply } from "@/hooks/useActionCreateReply";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type Props = {
  username: string;
  commentId: string;
  setIsShow: Dispatch<SetStateAction<boolean>>;
};
const FormReply = ({ setIsShow, commentId, username }: Props) => {
  const [message, setMessage] = useState(`@${username} `);
  const { execute, hasSucceeded, isExecuting } =
    useActionCreateReply(commentId);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (hasSucceeded) {
      ref.current?.reset();
      setIsShow(false);
    }
  }, [hasSucceeded]);

  return (
    <form action={execute} className="px-1">
      <fieldset disabled={isExecuting}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          name="message"
          placeholder="Write your reply..."
          type="text"
          className="w-full rounded border border-skin bg-background px-2 py-1 text-sm"
        />
        <div className="space-x-2 py-2">
          <button
            onClick={() => setIsShow(false)}
            className="rounded bg-gray-500 px-2 py-1 text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-skin-fill px-2 py-1 text-xs"
          >
            Send
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default FormReply;
