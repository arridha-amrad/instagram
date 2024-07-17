import { TPost } from "@/fetchings/type";
import { usePostStore } from "@/stores/PostStore";
import Link from "next/link";
import Carousel from "./Carousel";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import Owner from "./Owner";
import Actions from "./PostActions";
import TotalLikes from "./TotalLikes";

type Props = {
  post: TPost;
  isFirst?: boolean;
};

const PostCard = ({ post, isFirst = false }: Props) => {
  const { setPost } = usePostStore();
  const urls = post.urls.map((u) => u.url);
  return (
    <article className="w-full">
      <Owner post={post} />
      <Carousel isFirstPost={isFirst} urls={urls} />
      <Actions post={post} />
      {post.sumLikes > 0 && (
        <TotalLikes postId={post.id} total={post.sumLikes} />
      )}
      {post.description && (
        <section id="post_description" className="line-clamp-2 text-sm">
          <h1 className="inline pr-2 font-semibold">{post.owner.username}</h1>
          <p className="inline text-skin-muted">{post.description}</p>
        </section>
      )}
      <Comments comments={post.comments} />
      {post.sumComments > 0 && (
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
      )}
      <CommentForm post={post} />
    </article>
  );
};

export default PostCard;
