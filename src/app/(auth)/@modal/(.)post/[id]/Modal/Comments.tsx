import { useCommentsStore } from "@/stores/CommentsStore";
import CommentCard from "./CommentCard";

const Comments = () => {
  const { comments } = useCommentsStore();
  return comments.map((comment) => (
    <CommentCard comment={comment} key={comment.id} />
  ));
};

export default Comments;
