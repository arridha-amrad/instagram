import { TPost } from "@/fetchings/type";
import { usePostStore } from "@/stores/PostStore";
import { HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import PostCardCarousel from "./Carousel";
import CommentForm from "./CommentForm";
import PostCardHeader from "./Owner";
import PostCardActions from "./PostActions";

type Props = {
  post: TPost;
};

const PostCard = ({ post }: Props) => {
  const { setPost } = usePostStore();
  return (
    <article className="w-full">
      <PostCardHeader post={post} />
      <PostCardCarousel urls={post.urls} />
      <PostCardActions post={post} />
      <section id="post_total_likes">
        <h1>
          {post.sumLikes} {post.sumLikes > 1 ? "likes" : "like"}
        </h1>
      </section>
      <section id="post_description" className="line-clamp-2 text-sm">
        <h1 className="inline pr-2 font-semibold">{post.owner.username}</h1>
        <p className="inline text-skin-muted">{post.description}</p>
      </section>
      <section id="post_comments" className="py-2">
        {post.comments.map((comment) => (
          <div className="flex items-start justify-between" key={comment.id}>
            <div>
              <h1 className="inline pr-2 text-sm font-semibold">{comment.owner.username}</h1>
              <p className="inline text-sm text-skin-muted">{comment.message}</p>
            </div>
            <button className="pl-2">
              <HeartIcon className="-4 w-4" />
            </button>
          </div>
        ))}
      </section>
      <div>
        <Link onClick={() => setPost(post)} scroll={false} href={`/post/${post.id}`}>
          <p className="text-sm text-skin-muted">
            {post.sumComments}&nbsp; {post.sumComments > 1 ? "comments" : "comment"}
          </p>
        </Link>
      </div>
      <CommentForm post={post} />
    </article>
  );
};

export default PostCard;
