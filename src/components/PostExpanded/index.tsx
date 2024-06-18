import { TPost } from "@/fetchings/type";
import Preview from "./Carousel";
import PostOwner from "./Owner";
import PostDescription from "./Description";
import Comments from "./Comments";
import Actions from "./Actions";
import CommentForm from "./CommentForm";
import useMeasure from "react-use-measure";

type Props = {
  post: TPost;
};

const PostExpanded = ({ post }: Props) => {
  const [ref, { height }] = useMeasure();

  return (
    <div className="flex">
      <section
        id="post_carousel"
        ref={ref}
        className="h-[90vh] w-max border-r border-skin bg-background"
      >
        <Preview postId={post.id} height={height} />
      </section>
      <section
        id="post_detail"
        className="flex w-[400px] flex-col bg-background"
      >
        <PostOwner post={post} />
        <section
          id="post_description_and_comments"
          className="flex flex-1 basis-0 flex-col items-start gap-4 overflow-y-auto px-4 py-4"
        >
          <PostDescription post={post} />
          <Comments />
        </section>
        <Actions post={post} />
        <section className="" id="comment_form">
          <CommentForm post={post} />
        </section>
      </section>
    </div>
  );
};

export default PostExpanded;
