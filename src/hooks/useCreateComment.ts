import { commentAction } from "@/actions/commentAction";
import { TCommentSchema, TPost, TReplySchema } from "@/fetchings/type";
import setNewCommentOnClient from "@/helpers/setNewCommentOnClient";
import setNewReplyOnClient from "@/helpers/setNewReplyOnClient";
import { useCommentsStore } from "@/stores/CommentsStore";
import { usePostStore } from "@/stores/PostStore";
import { useReplySetter } from "@/stores/ReplySetter";
import { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type Args = {
  post: TPost;
  session: Session | null;
};

export const useCreateComment = ({ post, session }: Args) => {
  const { setFocusToCommentForm, isFocusToCommentForm, commentTarget, id } = useReplySetter();
  const { theme } = useTheme();
  const { increaseComment } = usePostStore();
  const { addComment, addReply } = useCommentsStore();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");
  const [replyState, setReplyState] = useState({
    userId: "",
    commentId: "",
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const ca = commentAction.bind(null, replyState.commentId, post.id, session?.user.id ?? "");
  const { execute, isExecuting, result, hasSucceeded, hasErrored } = useAction(ca);

  useEffect(() => {
    if (hasErrored) {
      toast.error("Something went wrong", { theme });
    }
  }, [hasErrored]);

  useEffect(() => {
    if (hasSucceeded && session?.user) {
      if (result.data?.msgComment) {
        increaseComment();
        setNewCommentOnClient({
          authUser: session.user,
          comment: result.data.data as TCommentSchema,
          setterFn: addComment,
        });
      }
      if (result.data?.msgReply) {
        setNewReplyOnClient({
          authUser: session.user,
          reply: result.data.data as TReplySchema,
          setterFn: addReply,
        });
      }
      setMessage("");
      formRef.current?.reset();
    }
    if (result.data?.err) {
      toast.error(result.data.err, { theme });
    }
  }, [hasSucceeded]);

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
