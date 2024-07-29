import { TFeedPost } from "@/lib/drizzle/queries/type";
import { cn } from "@/lib/utils";
import ChatBubbleOvalLeftIcon from "@heroicons/react/24/outline/ChatBubbleOvalLeftIcon";
import Link from "next/link";
import { forwardRef, Ref } from "react";
import ButtonLike from "./ButtonLike";
import Carousel from "./Carousel";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import Owner from "./Owner";
import TotalLikes from "./TotalLikes";

type Props = {
  post: TFeedPost;
  isFirst?: boolean;
};

const Post = ({ post, isFirst = false }: Props, ref: Ref<HTMLElement>) => {
  const urls = post.urls.map((u) => u.url);
  return (
    <article
      ref={ref}
      className={cn("w-full space-y-2", !isFirst ? "pt-10" : "")}
    >
      <Owner post={post} />
      <Carousel isFirstPost={isFirst} urls={urls} />
      <div className="flex items-center gap-3">
        <ButtonLike postId={post.id} isLiked={post.isLiked} />
        <Link scroll={false} href={`/post/${post.id}`}>
          <ChatBubbleOvalLeftIcon className="aspect-square w-7 -scale-x-100" />
        </Link>
      </div>
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
