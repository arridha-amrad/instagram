import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import PostLikeButton from "./Like/PostLikeButton";
import { TPost } from "@/app/(auth)/postsFetching";

type Props = {
  post: TPost;
};

const PostActions = ({ post }: Props) => {
  return (
    <div className="h-[40px] flex items-center gap-3">
      <PostLikeButton post={post} />
      <button>
        <ChatBubbleOvalLeftIcon className="w-7 aspect-square -scale-x-100" />
      </button>
    </div>
  );
};

export default PostActions;
