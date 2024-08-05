"use client";

import useMeasure from "react-use-measure";
import Preview from "./Carousel";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import PostDescription from "./Description";
import PostOwner from "./Owner";
import { TPost } from "@/lib/drizzle/queries/type";
import { formatDistanceToNowStrict } from "date-fns";
import ChatBubbleOvalLeftIcon from "@heroicons/react/24/outline/ChatBubbleOvalLeftIcon";
import ButtonLikePost from "./ButtonLike";

type Props = {
  post: TPost;
};

const PostExpanded = ({ post }: Props) => {
  const [ref, { height }] = useMeasure();
  const urls = post.urls.map(({ url }) => url);

  return (
    <div className="flex">
      <section
        id="post_carousel"
        ref={ref}
        className="h-[90vh] w-max border-r border-skin bg-background"
      >
        <Preview urls={urls} height={height} />
      </section>
      <section
        id="post_detail"
        className="flex w-[500px] flex-col bg-background"
      >
        <PostOwner user={post.owner} />
        <section
          id="post_description_and_comments"
          className="flex flex-1 basis-0 flex-col items-start overflow-y-auto px-4 py-4"
        >
          {post.description && (
            <PostDescription
              username={post.owner.username}
              avatar={post.owner.avatar}
              createdAt={post.createdAt}
              description={post.description}
            />
          )}
          <Comments />
        </section>
        <section id="post_actions_and_info">
          <div className="w-full px-4 py-2">
            <div className="flex items-center gap-3 pt-2">
              <ButtonLikePost isLiked={post.isLiked} postId={post.id} />
              <button>
                <ChatBubbleOvalLeftIcon className="aspect-square w-7 -scale-x-100" />
              </button>
            </div>
            <div className="px-1 pt-2">
              <h1 className="font-semibold">
                {post.sumLikes}
                <span className="pl-1 text-sm">
                  {post.sumLikes > 1 ? "likes" : "like"}
                </span>
              </h1>
              <p className="text-xs text-skin-muted">
                {formatDistanceToNowStrict(post.createdAt)}
              </p>
            </div>
          </div>
        </section>
        <section id="comment_form">
          <CommentForm post={post} />
        </section>
      </section>
    </div>
  );
};

export default PostExpanded;
