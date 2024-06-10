import { HeartIcon } from "@heroicons/react/24/outline";
import { TPost } from "../../../../fetchings/postsFetching";
import PostImagesCarousel from "../PostImagesCarousel";
import CommentForm from "./CommentForm";
import PostActions from "./PostActions";
import PostHeader from "./PostHeader";

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
          {post.likes} {post.likes > 1 ? "likes" : "like"}
        </h1>
      </div>
      <section className="line-clamp-2 text-sm">
        <h1 className="font-semibold inline pr-2">{post.owner.username}</h1>
        <p className="text-skin-muted inline">{post.description}</p>
      </section>
      <section className="py-2">
        {post.comments.map((comment) => (
          <div className="flex justify-between items-start" key={comment.id}>
            <div>
              <h1 className="text-sm font-semibold inline pr-2">
                {comment.owner.username}
              </h1>
              <p className="text-sm text-skin-muted inline">
                {comment.message}
              </p>
            </div>
            <button className="pl-2">
              <HeartIcon className="w-4 -4" />
            </button>
          </div>
        ))}
      </section>
      <CommentForm post={post} />
    </article>
  );
};

export default PostCard;
