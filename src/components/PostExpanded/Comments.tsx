"use client";

import { useCommentsStore } from "@/stores/CommentsStore";
import Comment from "@/components/Comment";

const Comments = () => {
  const { comments } = useCommentsStore();
  return comments.map((comment) => <Comment comment={comment} key={comment.id} />);
};

export default Comments;
