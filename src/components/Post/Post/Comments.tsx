"use client";

import Comment from "@/components/Comment";
import MySpinner from "@/components/Spinner";
import { useComments } from "@/stores/useComments";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { loadMoreComments } from "@/lib/actions/comment";

type Props = {
  showForm?: boolean;
};

const Comments = ({ showForm }: Props) => {
  const { comments, hasMore, addComments, cDate } = useComments();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const pathname = usePathname();

  const loadMore = async () => {
    setLoading(true);
    try {
      const response = await loadMoreComments.bind(
        null,
        pathname,
      )({
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
        <Comment showForm={showForm} comment={comment} key={comment.id} />
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
