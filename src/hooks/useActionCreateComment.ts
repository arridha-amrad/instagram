import { create } from "@/lib/actions/comment";
import { showToast } from "@/lib/utils";
import { useComments } from "@/stores/useComments";
import { useAction } from "next-safe-action/hooks";
import { usePathname } from "next/navigation";

export const useActionCreateComment = (postId: string) => {
  const pathname = usePathname();
  const action = create.bind(null, postId, pathname);
  const { addComment } = useComments();
  const { execute, isExecuting, hasSucceeded } = useAction(action, {
    onError: () => {
      showToast("something went wrong", "error");
    },
    onSuccess: ({ data }) => {
      if (data) {
        addComment(data);
      }
    },
  });

  return {
    exeComment: execute,
    isExeComment: isExecuting,
    isSuccess: hasSucceeded,
  };
};
