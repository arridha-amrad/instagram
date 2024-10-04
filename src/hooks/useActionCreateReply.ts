import { actionCreateReply } from "@/lib/next-safe-action/actionCreateReply";
import { useComments } from "@/stores/useComments";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";

export const useActionCreateReply = (commentId: string) => {
  const replyAction = actionCreateReply.bind(null, commentId);
  const { addReply } = useComments();
  const { theme } = useTheme();
  const { execute, isExecuting, hasSucceeded } = useAction(replyAction, {
    onError: () => {
      toast.error("Something went wrong", { theme });
    },
    onSuccess: ({ data }) => {
      if (!data) return;
      addReply(data);
    },
  });

  return {
    execute,
    isExecuting,
    hasSucceeded,
  };
};
