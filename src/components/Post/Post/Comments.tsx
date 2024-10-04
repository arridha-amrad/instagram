"use client";

import Comment from "@/components/Comment";
import ButtonReply from "@/components/Comment/Reply/ButtonReply";
import MySpinner from "@/components/Spinner";
import { actionFetchComments } from "@/lib/next-safe-action/actionFetchComments";
import { useComments } from "@/stores/useComments";
import { useParams } from "next/navigation";
import { useState } from "react";

type Props = {
  isShowInput?: boolean;
};

const Comments = ({ isShowInput }: Props) => {
  const { comments, hasMore, addComments, cDate } = useComments();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const loadMore = async () => {
    setLoading(true);
    try {
      const response = await actionFetchComments({
        postId: id as string,
        date: new Date(cDate),
      });
      const newComments = response?.data;
      if (newComments) {
        addComments(newComments);
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
        <Comment comment={comment} key={comment.id}>
          {isShowInput ? (
            <button>Reply</button>
          ) : (
            <ButtonReply commentId={comment.id} username={comment.username} />
          )}
        </Comment>
      ))}
      {hasMore && (
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
