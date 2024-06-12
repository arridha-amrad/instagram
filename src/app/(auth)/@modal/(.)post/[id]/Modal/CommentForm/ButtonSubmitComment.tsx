import MySpinner from "@/components/Spinner";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

type Props = {
  message: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonSubmitComment = ({ message }: Props) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={cn(
        "text-sm px-2 bg-background h-full",
        message.length > 0
          ? "text-skin-inverted font-semibold"
          : "text-skin-muted/50"
      )}
    >
      {pending ? <MySpinner /> : "Send"}
    </button>
  );
};

export default ButtonSubmitComment;
