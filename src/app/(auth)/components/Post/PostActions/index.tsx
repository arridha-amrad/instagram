import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import PostLikeButton from "./Like/PostLikeButton";
import { TPost } from "@/app/(auth)/postsFetching";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  post: TPost;
};

const PostActions = ({ post }: Props) => {
  const router = useRouter();
  return (
    <div className="h-[40px] flex items-center gap-3">
      <PostLikeButton post={post} />
      <Link
        scroll={false}
        href={`/post/${post.id}`}
        // onClick={() => router.push(`/post/${post.id}`, { scroll: false })}
      >
        <ChatBubbleOvalLeftIcon className="w-7 aspect-square -scale-x-100" />
      </Link>
    </div>
  );
};

export default PostActions;
