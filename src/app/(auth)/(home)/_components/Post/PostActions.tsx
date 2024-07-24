import ButtonLikePost from "@/components/ButtonLikePost";
import { TPost } from "@/fetchings/type";
import { usePostPageStore } from "@/lib/zustand/postPageStore";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
  post: TPost;
};

const PostActions = ({ post }: Props) => {
  const { setPost } = usePostPageStore();
  return (
    <div className="flex items-center gap-3 py-2">
      <ButtonLikePost post={post} />
      <Link
        onClick={() => setPost(post)}
        scroll={false}
        href={`/post/${post.id}`}
      >
        <ChatBubbleOvalLeftIcon className="aspect-square w-7 -scale-x-100" />
      </Link>
    </div>
  );
};

export default PostActions;
