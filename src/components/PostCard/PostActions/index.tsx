import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import PostLikeButton from "./Like/PostLikeButton";
import Link from "next/link";
import { TPost } from "@/fetchings/type";

type Props = {
  post: TPost;
};

const PostActions = ({ post }: Props) => {
  return (
    <div className="h-[40px] flex items-center gap-3">
      <PostLikeButton post={post} />
      <Link scroll={false} href={`/post/${post.id}`}>
        <ChatBubbleOvalLeftIcon className="w-7 aspect-square -scale-x-100" />
      </Link>
    </div>
  );
};

export default PostActions;
