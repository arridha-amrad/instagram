import { actionLikeReply } from "@/lib/next-safe-action/actionLikeReply";
import { useComments } from "@/stores/useComments";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";

type Props = {
  commentId: string;
  replyId: string;
  isLiked: boolean;
};

const ButtonLikeReply = ({ commentId, isLiked, replyId }: Props) => {
  const { likeReply } = useComments();
  const { theme } = useTheme();
  const pathname = usePathname();

  const like = async () => {
    likeReply(commentId, replyId);
    try {
      await actionLikeReply({ replyId, pathname });
    } catch (err) {
      toast.error("Something went wrong", { theme });
    }
  };

  return (
    <button
      onClick={like}
      type="submit"
      className="flex aspect-square w-5 items-start justify-end"
    >
      {isLiked ? (
        <Heart className="aspect-square w-4 fill-pink-600" />
      ) : (
        <HeartIcon className="aspect-square w-4" />
      )}
    </button>
  );
};

export default ButtonLikeReply;
