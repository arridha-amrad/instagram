import Comment from "./Comment";
import { TFeedComment } from "@/lib/drizzle/queries/type";

type Props = {
  comments: TFeedComment[];
};

const Comments = ({ comments }: Props) => {
  if (!comments) return null;
  return (
    <section id="post_comments" className="">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </section>
  );
};

export default Comments;
