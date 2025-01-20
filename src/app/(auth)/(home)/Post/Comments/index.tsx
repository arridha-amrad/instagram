import { TFeedComment } from "@/app/(auth)/(home)/Post/store";
import Comment from "./Comment";

type Props = {
  comments: TFeedComment[];
};

const Comments = ({ comments }: Props) => {
  return (
    <section id="post_comments" className="">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </section>
  );
};

export default Comments;
