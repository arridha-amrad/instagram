import { TPost } from "@/fetchings/type";
import {
  ChatBubbleOvalLeftIcon,
  DocumentDuplicateIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import PostLink from "./PostLink";

type Props = {
  post: TPost;
};

const Post = ({ post }: Props) => {
  return (
    <PostLink post={post}>
      <Image
        src={post.urls[0].url}
        alt="post_image"
        width={300}
        height={300}
        className="h-full w-full object-cover"
      />
      {post.urls.length > 1 && (
        <div className="absolute right-2 top-2">
          <DocumentDuplicateIcon className="aspect-square w-4 md:w-5" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 hover:opacity-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 md:gap-2">
            <HeartIcon className="aspect-square w-5 md:w-8" />
            <p className="text-sm md:text-base">{post.sumLikes}</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <ChatBubbleOvalLeftIcon className="aspect-square w-5 -scale-x-100 md:w-8" />
            <p className="text-sm md:text-base">{post.sumComments}</p>
          </div>
        </div>
      </div>
    </PostLink>
  );
};

export default Post;
