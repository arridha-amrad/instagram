"use client";

import { useCommentsStore } from "@/stores/CommentsStore";
import Comment from "@/components/Comment";
import { loadMoreComments } from "./action";
import { useParams } from "next/navigation";
import { useState } from "react";
import MySpinner from "@/components/Spinner";
import { useSessionStore } from "@/stores/Session";
import usePostsStore from "@/stores/Posts";

const Comments = () => {
  const { total, page, addMoreComments } = useCommentsStore();
  const { post } = usePostsStore();
  if (!post) return null;
  const { session } = useSessionStore();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const loadMore = async () => {
    setLoading(true);
    try {
      const response = await loadMoreComments({
        postId: id as string,
        userId: session?.user.id,
        page: page + 1,
      });
      if (response?.data) {
        addMoreComments(response.data.comments);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {post.comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
      {post.comments.length < post.sumComments && (
        <button
          disabled={loading}
          onClick={loadMore}
          className="relative flex w-full items-center justify-center border border-skin py-2 text-skin-muted"
        >
          load more
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <MySpinner />
            </div>
          )}
        </button>
      )}
    </>
  );
};

export default Comments;
