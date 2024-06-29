import { TReply } from "@/fetchings/type";
import { useCommentsStore } from "@/stores/CommentsStore";
import { useSessionStore } from "@/stores/SessionStore";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { likeReplyAction } from "./actionLike";

type Props = {
  reply: TReply;
};

const ButtonLikeReply = ({ reply }: Props) => {
  const { session } = useSessionStore();
  const { likeReply } = useCommentsStore();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  const like = async () => {
    likeReply({ commentId: reply.commentId, replyId: reply.id });
    const authUser = session?.user;
    if (authUser && authUser.id) {
      const result = await likeReplyAction({
        replyId: reply.id,
        userId: authUser.id,
      });
      if (result?.serverError) {
        toast.error("Something went wrong on the server", { theme });
      }
    } else {
      router.replace(`/login?cbUrl=${pathname}`);
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
