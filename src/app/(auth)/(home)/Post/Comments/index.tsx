import { TFeedComment } from "@/stores/useFeedPosts";
import Comment from "./Comment";

type Props = {
  comments: TFeedComment[];
};

const Comments = ({ comments }: Props) => {
  return (
    <section id="post_comments" className="">
      {comments.map((comment, i) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </section>
  );
};

export default Comments;
