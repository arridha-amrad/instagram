import MySpinner from "@/components/Spinner";
import { useFormStatus } from "react-dom";

type Props = {
  sumReplies: number;
};

const ButtonShowReplies = ({ sumReplies }: Props) => {
  const { pending } = useFormStatus();
  return (
    <div className="relative">
      <button
        disabled={pending}
        type="submit"
        className="text-xs text-skin-muted"
      >
        See {sumReplies} replies
      </button>
      {pending && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <MySpinner />
        </div>
      )}
    </div>
  );
};

export default ButtonShowReplies;
