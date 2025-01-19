import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { FeedPost } from "@/stores/useFeedPosts";
import ChatBubbleOvalLeftIcon from "@heroicons/react/24/outline/ChatBubbleOvalLeftIcon";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import ButtonLike from "./ButtonLike";
import Carousel from "./Carousel";
import Comments from "./Comments";

import TotalLikes from "./Likes";
import FormComment from "./FormComment";

type Props = {
  post: FeedPost;
  sessionUserId: string;
};

const Post = ({ post, sessionUserId }: Props) => {
  const urls = post.urls.map((u) => u.url);
  return (
    <article className={cn("w-full space-y-2 pb-14")}>
      <section className="flex w-full items-center gap-3 text-sm">
        <Avatar className="w-9" url={post.avatar} />
        <div>
          <Link
            href={`/${post.username}`}
            className="font-semibold hover:underline"
          >
            {post.username}
          </Link>
          <p className="text-skin-muted">{post.location}</p>
        </div>
        <div className="aspect-square w-1 rounded-full bg-neutral-500" />
        <p className="text-skin-muted">
          {formatDistanceToNowStrict(post.createdAt)}
        </p>
      </section>
      <Carousel urls={urls} />
      <div className="flex items-center gap-3">
        <ButtonLike postId={post.id} isLiked={post.isLiked} />
        <Link scroll={false} href={`/post/${post.id}`}>
          <ChatBubbleOvalLeftIcon className="aspect-square w-7 -scale-x-100" />
        </Link>
      </div>
      {post.sumLikes > 0 && (
        <TotalLikes
          sessionUserId={sessionUserId}
          postId={post.id}
          total={post.sumLikes}
        />
      )}
      {post.description && (
        <section id="post_description" className="line-clamp-2 text-sm">
          <h1 className="inline pr-2 font-semibold">{post.username}</h1>
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
      {post.comments && <Comments comments={post.comments} />}
      <FormComment postId={post.id} />
    </article>
  );
};

export default Post;
