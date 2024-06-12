import { Dispatch, SetStateAction } from "react";
import ButtonSubmitComment from "./ButtonSubmitComment";
import { useFormStatus } from "react-dom";
import MySpinner from "@/components/Spinner";

type Props = {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
};

const CommentInput = ({ message, setMessage }: Props) => {
  const { pending } = useFormStatus();
  return (
    <div className="relative flex items-center w-full h-full">
      {pending && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <MySpinner />
        </div>
      )}
      <div className="flex-1">
        <fieldset disabled={pending}>
          <input
            value={message}
            name="message"
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Add comment..."
            className="w-full text-sm h-12 flex-1 border-none bg-background focus:ring-0 px-4"
          />
        </fieldset>
      </div>
      <ButtonSubmitComment message={message} />
    </div>
  );
};

export default CommentInput;
