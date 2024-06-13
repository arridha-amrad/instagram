import PostLikeButton from "@/components/PostLikeButton";
import { TPost } from "@/fetchings/type";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
  post: TPost;
};

const PostActions = ({ post }: Props) => {
  return (
    <div className="flex h-[50px] items-center gap-3">
      <PostLikeButton post={post} />
      <Link scroll={false} href={`/post/${post.id}`}>
        <ChatBubbleOvalLeftIcon className="aspect-square w-7 -scale-x-100" />
      </Link>
    </div>
  );
};

export default PostActions;
