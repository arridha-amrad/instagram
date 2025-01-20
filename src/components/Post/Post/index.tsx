"use client";

import { formatDistanceToNowStrict } from "date-fns";
import ButtonLikePost from "./ButtonLike";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import Avatar from "@/components/Avatar";
import Link from "next/link";
import { ReactNode, useRef, useState } from "react";
import ButtonComment from "./ButtonComment";
import { TPost } from "@/lib/drizzle/queries/posts/fetchPost";
import ButtonLike from "@/components/ButtonLike";
import { likePost } from "@/lib/actions/post";
import { usePathname } from "next/navigation";

type Props = {
  post: TPost;
  children: ReactNode;
};

const PostExpanded = ({ post, children }: Props) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [totalLikes, setTotalLikes] = useState(post.sumLikes);
  const pathname = usePathname();

  const like = async () => {
    await likePost.bind(null, pathname)({ postId: post.id });
    if (isLiked) {
      setTotalLikes((val) => (val -= 1));
      setIsLiked(false);
    } else {
      setTotalLikes((val) => (val += 1));
      setIsLiked(true);
    }
  };

  const commentInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="flex overflow-hidden rounded-lg border border-skin">
      <section
        id="post_carousel"
        className="h-[90vh] w-max border-r border-skin bg-background"
      >
        {children}
      </section>
      <section
        id="post_detail"
        className="flex w-[500px] flex-col bg-background"
      >
        <section id="post_owner" className="p-4">
          <div className="flex items-center gap-3">
            <Avatar url={post.avatar} />
            <div>
              <Link
                href={`/${post.username}`}
                className="text-sm font-semibold"
              >
                {post.username}
              </Link>
            </div>
          </div>
        </section>
        <section className="flex flex-1 basis-0 flex-col items-start overflow-y-auto border-t border-skin p-4">
          {post.description && (
            <section id="post_description" className="flex gap-2">
              <div>
                <Avatar url={post.avatar} />
              </div>
              <div className="pt-0.5">
                <Link
                  href={`/${post.username}`}
                  className="inline pr-2 text-sm font-semibold"
                >
                  {post.username}
                </Link>
                <p className="inline text-sm text-skin-muted">
                  {post.description}
                </p>
                <div className="py-2">
                  <p className="text-xs text-skin-muted">
                    {formatDistanceToNowStrict(post.createdAt)}
                  </p>
                </div>
              </div>
            </section>
          )}
          <Comments />
        </section>
        <section className="border-t border-skin">
          <div className="w-full p-4">
            <div className="flex items-center gap-3">
              <ButtonLike callback={like} isLike={post.isLiked} size="normal" />
              <ButtonComment
                focusToCommentInput={() => commentInputRef.current?.focus()}
              />
            </div>
            <div className="px-1 pt-2">
              <h1 className="font-semibold">
                {totalLikes}
                <span className="pl-1 text-sm">
                  {totalLikes > 1 ? "likes" : "like"}
                </span>
              </h1>
              <p className="text-xs text-skin-muted">
                {formatDistanceToNowStrict(post.createdAt)}
              </p>
            </div>
          </div>
        </section>
        <section className="border-t border-skin" id="comment_form">
          <CommentForm ref={commentInputRef} post={post} />
        </section>
      </section>
    </div>
  );
};

export default PostExpanded;
