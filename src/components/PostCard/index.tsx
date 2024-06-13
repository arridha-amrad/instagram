import { HeartIcon } from "@heroicons/react/24/outline";

import PostImagesCarousel from "./PostImagesCarousel";
import CommentForm from "./CommentForm";
import PostActions from "./PostActions";
import PostHeader from "./PostHeader";
import { TPost } from "@/fetchings/type";

type Props = {
  post: TPost;
};

const PostCard = ({ post }: Props) => {
  return (
    <article className="w-full pb-10">
      <PostHeader post={post} />
      <PostImagesCarousel urls={post.urls} />
      <div className="h-1" />
      <PostActions post={post} />
      <div>
        <h1>
          {post.sumLikes} {post.sumLikes > 1 ? "likes" : "like"}
        </h1>
      </div>
      <section className="line-clamp-2 text-sm">
        <h1 className="inline pr-2 font-semibold">{post.owner.username}</h1>
        <p className="inline text-skin-muted">{post.description}</p>
      </section>
      <section className="py-2">
        {post.comments.map((comment) => (
          <div className="flex items-start justify-between" key={comment.id}>
            <div>
              <h1 className="inline pr-2 text-sm font-semibold">
                {comment.owner.username}
              </h1>
              <p className="inline text-sm text-skin-muted">
                {comment.message}
              </p>
            </div>
            <button className="pl-2">
              <HeartIcon className="-4 w-4" />
            </button>
          </div>
        ))}
      </section>
      <CommentForm post={post} />
    </article>
  );
};

export default PostCard;
