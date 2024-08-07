"use client";

import Comment from "@/components/Comment";

import { useParams } from "next/navigation";
import { useState } from "react";
import MySpinner from "@/components/Spinner";
import { useSessionStore } from "@/stores/Session";
import usePostsStore from "@/stores/Posts";
import { actionFetchComments } from "@/lib/next-safe-action/actionFetchComments";

const Comments = () => {
  const { post, addMoreComments } = usePostsStore();
  if (!post) return null;

  const page = post.comments.page;
  const { session } = useSessionStore();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const loadMore = async () => {
    setLoading(true);
    try {
      const response = await actionFetchComments({
        postId: id as string,
        authUserId: session?.user.id,
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
      {post.comments.data.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
      {post.comments.data.length < post.comments.total && (
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
