import { TComment } from "@/fetchings/type";
import Comment from "./Comment";

type Props = {
  comments: TComment[];
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
