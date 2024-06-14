import like from "@/actions/reply/like";
import { TReply } from "@/fetchings/type";
import { useCommentsStore } from "@/stores/CommentsStore";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";

type Props = {
  reply: TReply;
};

const initialState = {
  type: "",
  message: "",
};

const ButtonLikeReply = ({ reply }: Props) => {
  const { data } = useSession();
  const { likeReply } = useCommentsStore();
  const likeAction = like.bind(null, {
    replyId: reply.id,
    userId: data?.user.id ?? "",
  });
  const [state, action] = useFormState(likeAction, initialState);
  const [mId, setMid] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (state.type === "error") {
      toast.error(state.message, { theme });
    }
  }, [mId]);

  return (
    <form
      action={() => {
        setMid(new Date().getTime());
        likeReply(reply);
        action();
      }}
    >
      <button
        disabled={!data?.user.id}
        type="submit"
        className="aspect-square w-5"
      >
        {reply.isLiked ? (
          <Heart className="aspect-square w-4 fill-pink-600" />
        ) : (
          <HeartIcon className="aspect-square w-4" />
        )}
      </button>
    </form>
  );
};

export default ButtonLikeReply;
