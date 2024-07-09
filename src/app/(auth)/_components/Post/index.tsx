import { TPost } from "@/fetchings/type";
import { usePostStore } from "@/stores/PostStore";
import { HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import PostCardCarousel from "./Carousel";
import CommentForm from "./CommentForm";
import PostCardHeader from "./Owner";
import PostCardActions from "./PostActions";
import TotalLikes from "./TotalLikes";

type Props = {
  post: TPost;
  isFirst?: boolean;
};

const PostCard = ({ post, isFirst = false }: Props) => {
  const { setPost } = usePostStore();
  return (
    <article className="w-full">
      <PostCardHeader post={post} />
      <PostCardCarousel isFirstPost={isFirst} urls={post.urls} />
      <PostCardActions post={post} />
      {post.sumLikes > 0 && (
        <TotalLikes postId={post.id} total={post.sumLikes} />
      )}
      <section id="post_description" className="line-clamp-2 text-sm">
        <h1 className="inline pr-2 font-semibold">{post.owner.username}</h1>
        <p className="inline text-skin-muted">{post.description}</p>
      </section>
      <section id="post_comments" className="py-1">
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
      <div>
        <Link
          onClick={() => setPost(post)}
          scroll={false}
          href={`/post/${post.id}`}
        >
          <p className="text-sm text-skin-muted">
            {post.sumComments}&nbsp;{" "}
            {post.sumComments > 1 ? "comments" : "comment"}
          </p>
        </Link>
      </div>
      <CommentForm post={post} />
    </article>
  );
};

export default PostCard;
