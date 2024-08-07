"use client";

import MySpinner from "@/components/Spinner";
import { TComment } from "@/lib/drizzle/queries/type";
import { actionFetchReplies } from "@/lib/next-safe-action/actionFetchReplies";
import usePostsStore from "@/stores/Posts";
import { useSessionStore } from "@/stores/Session";
import { useTheme } from "next-themes";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  comment: TComment;
  setIsShowReplies: Dispatch<SetStateAction<boolean>>;
  isShowReplies: boolean;
};

const ButtonFetchReplies = ({
  comment,
  isShowReplies,
  setIsShowReplies,
}: Props) => {
  const { addReplies } = usePostsStore();
  const { session } = useSessionStore();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { theme } = useTheme();

  const fetchReplies = async () => {
    setIsLoading(true);
    try {
      const result = await actionFetchReplies({
        commentId: comment.id,
        page,
        authUserId: session?.user.id,
      });
      if (result?.data) {
        addReplies(result.data.data, comment.id);
        setPage((v) => v + 1);
      }
    } catch (err) {
      toast.error("Something went wrong", { theme });
    } finally {
      setIsLoading(false);
    }
  };

  if (comment.sumRepliesRemaining > 0) {
    return (
      <div className="relative py-3">
        <button
          onClick={fetchReplies}
          disabled={isLoading}
          type="submit"
          className="text-xs font-semibold text-skin-muted"
        >
          View {comment.sumRepliesRemaining} replies
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
