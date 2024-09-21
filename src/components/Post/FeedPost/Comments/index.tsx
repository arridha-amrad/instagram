import { FeedComment } from "@/stores/useFeedPosts";
import Comment from "./Comment";

type Props = {
  comments: FeedComment[];
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
