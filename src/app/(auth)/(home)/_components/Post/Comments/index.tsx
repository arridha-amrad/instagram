import { TComment } from "@/fetchings/type";
import Comment from "./Comment";

type Props = {
  comments: TComment[];
};

const Comments = ({ comments }: Props) => {
  return (
    <section id="post_comments" className="py-1">
      {comments.map((comment) => (
        <Comment comment={comment} />
      ))}
    </section>
  );
};

export default Comments;
