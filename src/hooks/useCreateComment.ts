import { commentAction } from "@/actions/commentAction";
import { TCommentSchema, TPost, TReplySchema } from "@/fetchings/type";
import setNewCommentOnClient from "@/helpers/setNewCommentOnClient";
import setNewReplyOnClient from "@/helpers/setNewReplyOnClient";
import { useHomePageStore } from "@/lib/zustand/homePageStore";
import { useCommentsStore } from "@/stores/CommentsStore";
import { useReplySetter } from "@/stores/ReplySetter";
import { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type Args = {
  post: TPost;
  session: Session | null;
};

export const useCreateComment = ({ post, session }: Args) => {
  const {
    setFocusToCommentForm,
    isFocusToCommentForm,
    commentTarget,
    id,
    reset,
  } = useReplySetter();

  const { theme } = useTheme();
  const { addComment: adC } = useHomePageStore();
  const { addComment, addReply } = useCommentsStore();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");
  const [replyState, setReplyState] = useState({
    userId: "",
    commentId: "",
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    reset();
    setMessage("");
    setReplyState({
      commentId: "",
      userId: "",
    });
  }, [pathname]);

  useEffect(() => {
    if (isFocusToCommentForm) {
      inputRef.current?.focus();
    }
  }, [isFocusToCommentForm]);

  useEffect(() => {
    if (commentTarget) {
      setReplyState({
        commentId: commentTarget.commentId,
        userId: commentTarget.userId,
      });
      inputRef.current?.focus();
      setMessage(`@${commentTarget.username} `);
    }
  }, [id]);

  useEffect(() => {
    if (message === "") {
      setReplyState({
        commentId: "",
        userId: "",
      });
    }
  }, [message]);

  const ca = commentAction.bind(null, replyState.commentId, post.id);

  const { execute, isExecuting } = useAction(ca, {
    onError: ({ error: { serverError } }) => {
      toast.error(serverError, { theme });
    },
    onSuccess: ({ data }) => {
      setMessage("");
      reset();
      formRef.current?.reset();
      if (!session) return;
      if (data?.comment) {
        setNewCommentOnClient({
          authUser: session?.user,
          comment: data.comment as TCommentSchema,
          setterFn: addComment,
        });
        setNewCommentOnClient({
          authUser: session?.user,
          comment: data.comment as TCommentSchema,
          setterFn: adC,
        });
      }
      if (data?.reply) {
        setNewReplyOnClient({
          authUser: session.user,
          reply: data.reply as TReplySchema,
          setterFn: addReply,
        });
      }
    },
  });

  return {
    setFocusToCommentForm,
    message,
    setMessage,
    isExecuting,
    formRef,
    execute,
    inputRef,
    session,
  };
};
