"use client";

import MySpinner from "@/components/Spinner";
import { actionFetchReplies } from "@/lib/next-safe-action/actionFetchReplies";
import { Comment, useComments } from "@/stores/useComments";
import { useTheme } from "next-themes";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  comment: Comment;
  setIsShowReplies: Dispatch<SetStateAction<boolean>>;
  isShowReplies: boolean;
};

const ButtonFetchReplies = ({
  comment,
  isShowReplies,
  setIsShowReplies,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { setReplies } = useComments();
  const [hasMore, setHasMore] = useState(true);

  const fetchReplies = async () => {
    setIsLoading(true);
    const date =
      comment.replies.length === 0
        ? new Date()
        : comment.replies[comment.replies.length - 1].createdAt;
    try {
      const result = await actionFetchReplies({
        commentId: comment.id,
        date,
      });
      const newReplies = result?.data;
      if (newReplies) {
        if (newReplies.length < 5) {
          setHasMore(false);
        }
        setReplies(newReplies);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      toast.error("Something went wrong", { theme });
    } finally {
      setIsLoading(false);
    }
  };

  if (hasMore && comment.sumReplies - comment.replies.length > 0) {
    return (
      <div className="relative py-3">
        <button
          onClick={fetchReplies}
          disabled={isLoading}
          type="submit"
          className="text-xs font-semibold text-skin-muted"
        >
          View {comment.sumReplies - comment.replies.length} replies
        </button>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <MySpinner />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="h-0.5 w-[30px] bg-gray-500" />
      {isShowReplies ? (
        <button
          onClick={() => setIsShowReplies(false)}
          className="text-xs font-semibold text-skin-muted"
        >
          Hide replies
        </button>
      ) : (
        <button
          onClick={() => setIsShowReplies(true)}
          className="text-xs font-semibold text-skin-muted"
        >
          View {comment.sumReplies} replies
        </button>
      )}
    </div>
  );
};

export default ButtonFetchReplies;
