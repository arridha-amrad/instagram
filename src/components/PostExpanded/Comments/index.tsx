"use client";

import { useCommentsStore } from "@/stores/CommentsStore";
import Comment from "@/components/Comment";
import { loadMoreComments } from "./safeAction";
import { useParams } from "next/navigation";
import { useSessionStore } from "@/stores/SessionStore";
import { useState } from "react";
import MySpinner from "@/components/Spinner";

const Comments = () => {
  const { comments, total, page, addMoreComments } = useCommentsStore();
  const { session } = useSessionStore();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const loadMore = async () => {
    setLoading(true);
    try {
      const response = await loadMoreComments({
        postId: id,
        userId: session?.user.id,
        page: page + 1,
      });
      if (response?.data) {
        addMoreComments(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
      {comments.length < total && (
        <div className="relative flex items-center justify-center border border-skin py-2">
          <button
            disabled={loading}
            onClick={loadMore}
            className="text-skin-muted"
          >
            load more
          </button>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <MySpinner />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Comments;
