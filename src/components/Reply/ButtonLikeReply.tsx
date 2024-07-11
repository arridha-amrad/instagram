import { TReply } from "@/fetchings/type";
import { useCommentsStore } from "@/stores/CommentsStore";
import { useSessionStore } from "@/stores/SessionStore";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";
import { likeReplyAction } from "./action";

type Props = {
  reply: TReply;
};

const ButtonLikeReply = ({ reply }: Props) => {
  const { session } = useSessionStore();
  const { likeReply } = useCommentsStore();
  const { theme } = useTheme();

  const like = async () => {
    likeReply({ commentId: reply.commentId, replyId: reply.id });
    const result = await likeReplyAction({
      replyId: reply.id
    });
    if (result?.serverError) {
      toast.error("Something went wrong", { theme });
    }
  };

  return (
    <button
      onClick={like}
      disabled={!session?.user.id}
      type="submit"
      className="flex aspect-square w-5 items-start justify-end"
    >
      {reply.isLiked ? (
        <Heart className="aspect-square w-4 fill-pink-600" />
      ) : (
        <HeartIcon className="aspect-square w-4" />
      )}
    </button>
  );
};

export default ButtonLikeReply;
