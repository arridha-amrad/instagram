import { TPost } from "../../postsFetching";
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
      <CommentForm />
    </article>
  );
};

export default PostCard;
