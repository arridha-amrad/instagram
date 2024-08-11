import { actionCreateReply } from "@/lib/next-safe-action/actionCreateReply";
import usePostsStore from "@/stores/Posts";
import { useSessionStore } from "@/stores/Session";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";

export const useActionCreateReply = (commentId: string) => {
  const replyAction = actionCreateReply.bind(null, commentId);
  const { addReply } = usePostsStore();
  const { theme } = useTheme();
  const { session } = useSessionStore();
  const { execute, isExecuting, hasSucceeded } = useAction(replyAction, {
    onError: () => {
      toast.error("Something went wrong", { theme });
    },
    onSuccess: ({ data }) => {
      const user = session?.user;
      if (!data || !user) return;
      const { username, id: iD, image } = user;
      addReply(data.commentId, {
        ...data,
        isLiked: false,
        owner: {
          avatar: image ?? null,
          id: iD ?? "",
          username,
        },
        sumLikes: 0,
      });
    },
  });

  return {
    execute,
    isExecuting,
    hasSucceeded,
  };
};
