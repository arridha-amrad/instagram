"use client";

import MySpinner from "@/components/Spinner";
import { loadMoreReplies } from "@/lib/actions/reply";
import { Comment, useComments } from "@/stores/useComments";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
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
  const [page, setPage] = useState(1);
  const pathname = usePathname();

  const fetchReplies = async () => {
    setIsLoading(true);
    try {
      const result = await loadMoreReplies.bind(
        null,
        pathname,
      )({
        commentId: comment.id,
        page,
      });
      const newReplies = result?.data;
      console.log({ newReplies });

      if (newReplies) {
        if (newReplies.length < 5) {
          setHasMore(false);
        }
        setPage((val) => val + 1);
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
      <div className="relative flex items-center gap-4 py-3">
        <div className="h-0.5 w-[30px] bg-gray-500" />
        <button
          onClick={fetchReplies}
          disabled={isLoading}
          type="submit"
          className="text-xs font-semibold text-skin-muted"
        >
          View {comment.sumReplies - comment.replies.length}{" "}
          {page > 1 && "more"} replies
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
