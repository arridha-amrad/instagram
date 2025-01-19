import { useComments } from "@/stores/useComments";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";
import { create } from "@/lib/actions/comment";

export const useActionCreateComment = (postId: string) => {
  const action = create.bind(null, postId);
  const { theme } = useTheme();
  const { addComment } = useComments();
  const { execute, isExecuting, hasSucceeded } = useAction(action, {
    onError: () => {
      toast.error("Something went wrong", { theme });
    },
    onSuccess: ({ data }) => {
      if (!data) return;
      addComment(data);
    },
  });

  return {
    exeComment: execute,
    isExeComment: isExecuting,
    isSuccess: hasSucceeded,
  };
};
