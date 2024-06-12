import { TComment } from "@/fetchings/type";
import { useFormState } from "react-dom";
import { TReply } from "@/fetchings/type";
import { getCommentReplies } from "@/actions/getCommentReplies";
import ButtonShowReplies from "./ButtonShowReplies";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useCommentsStore } from "@/stores/CommentsStore";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

type Props = {
  comment: TComment;
  setIsShowReplies: Dispatch<SetStateAction<boolean>>;
  isShowReplies: boolean;
};

const initialState = {
  data: [] as TReply[],
  type: "",
};

const ShowReplies = ({ comment, isShowReplies, setIsShowReplies }: Props) => {
  const { setReplies } = useCommentsStore();
  const { data } = useSession();
  const gcr = getCommentReplies.bind(null, {
    commentId: comment.id,
    userId: data?.user.id,
  });
  const [formState, formAction] = useFormState(gcr, initialState);
  const [id, setId] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (formState.data.length > 0) {
      setReplies(comment.id, formState.data);
    }
    if (formState.type === "error") {
      toast.error("Something went wrong", { theme });
    }
  }, [id]);

  if (comment.sumReplies === 0) {
    return null;
  }

  return comment.sumRepliesRemaining > comment.replies.length ? (
    <form
      action={() => {
        setId(new Date().getTime());
        formAction();
      }}
      className="flex items-center gap-4 py-3"
    >
      <div className="w-[30px] bg-gray-500 h-0.5" />
      <ButtonShowReplies sumReplies={comment.sumReplies} />
    </form>
  ) : (
    <div className="flex items-center gap-4 py-3">
      <div className="w-[30px] bg-gray-500 h-0.5" />
      {isShowReplies ? (
        <button
          onClick={() => setIsShowReplies(false)}
          className="text-xs text-skin-muted"
        >
          Hide replies
        </button>
      ) : (
        <button
          onClick={() => setIsShowReplies(true)}
          className="text-xs text-skin-muted"
        >
          View ${comment.sumReplies} replies
        </button>
      )}
    </div>
  );
};

export default ShowReplies;
