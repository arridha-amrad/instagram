import { TPost } from "@/fetchings/type";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef, Ref } from "react";
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

const Post = ({ post, isFirst = false }: Props, ref: Ref<HTMLElement>) => {
  const urls = post.urls.map((u) => u.url);
  return (
    <article
      ref={ref}
      className={cn("w-full space-y-2", !isFirst ? "py-4" : "")}
    >
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
      {post.sumComments > 0 && (
        <Link className="block" scroll={false} href={`/post/${post.id}`}>
          <span className="text-sm text-skin-muted">
            {post.sumComments}&nbsp;{" "}
            {post.sumComments > 1 ? "comments" : "comment"}
          </span>
        </Link>
      )}
      <Comments comments={post.comments} />
      <CommentForm post={post} />
    </article>
  );
};

export default forwardRef(Post);
