import { actionCreateComment } from "@/lib/next-safe-action/actionCreateComment";
import usePostsStore from "@/stores/Posts";
import { useSessionStore } from "@/stores/Session";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";

export const useActionCreateComment = (postId: string) => {
  const action = actionCreateComment.bind(null, postId);
  const { session } = useSessionStore();
  const { theme } = useTheme();
  const { addComment } = usePostsStore();

  const { execute, isExecuting, hasSucceeded } = useAction(action, {
    onError: () => {
      toast.error("Something went wrong", { theme });
    },
    onSuccess: ({ data }) => {
      const user = session?.user;
      if (!data || !user) return;
      const { username, id: iD, image } = user;
      addComment({
        ...data,
        isLiked: false,
        owner: {
          avatar: image ?? "",
          id: iD ?? "",
          username,
        },
        replies: {
          date: new Date(),
          data: [],
          page: 0,
          total: 0,
        },
        sumLikes: 0,
        sumReplies: 0,
        sumRepliesRemaining: 0,
      });
    },
  });

  return {
    exeComment: execute,
    isExeComment: isExecuting,
    isSuccess: hasSucceeded,
  };
};
