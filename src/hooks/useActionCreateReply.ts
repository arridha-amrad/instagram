import { create } from "@/lib/actions/reply";
import { showToast } from "@/lib/utils";
import { useComments } from "@/stores/useComments";
import { useAction } from "next-safe-action/hooks";
import { usePathname } from "next/navigation";

export const useActionCreateReply = (commentId: string) => {
  const pathname = usePathname();
  const replyAction = create.bind(null, commentId, pathname);
  const { addReply } = useComments();
  const { execute, isExecuting, hasSucceeded } = useAction(replyAction, {
    onError: () => {
      showToast("something went wrong", "error");
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
