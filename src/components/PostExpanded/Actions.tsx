import { TPost } from "@/fetchings/type";
import { formatDistanceToNowStrict } from "date-fns";

import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import PostLikeButton from "../ButtonLikePost";

type Props = {
  post: TPost;
};
const Actions = ({ post }: Props) => {
  return (
    <section id="post_actions_and_info">
      <div className="w-full px-4 py-2">
        <div className="flex items-center gap-3 pt-2">
          <PostLikeButton post={post} />
          <button>
            <ChatBubbleOvalLeftIcon className="aspect-square w-7 -scale-x-100" />
          </button>
        </div>
        <div className="px-1 pt-2">
          <h1 className="font-semibold">
            {post.sumLikes}
            <span className="pl-1 text-sm">
              {post.sumLikes > 1 ? "likes" : "like"}
            </span>
          </h1>
          <p className="text-xs text-skin-muted">
            {formatDistanceToNowStrict(post.createdAt)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Actions;
