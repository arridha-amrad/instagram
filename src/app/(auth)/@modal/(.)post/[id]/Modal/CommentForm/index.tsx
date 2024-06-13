import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useFormState } from "react-dom";
import { commentAction } from "@/actions/commentAction";
import { toast } from "react-toastify";
import { TCommentSchema, TPost, TReplySchema } from "@/fetchings/type";
import { useReplySetter } from "@/stores/ReplySetter";
import CommentInput from "./CommentInput";
import { useCommentsStore } from "@/stores/CommentsStore";
import setNewCommentOnClient from "@/helpers/setNewCommentOnClient";
import setNewReplyOnClient from "@/helpers/setNewReplyOnClient";

type Props = {
  post: TPost;
};

const initialState = {
  message: "",
  type: "",
  content: "",
  errros: {} as any,
  data: {} as TCommentSchema | TReplySchema,
};

const CommentForm = ({ post }: Props) => {
  const { commentTarget } = useReplySetter();
  const { data } = useSession();
  const { theme } = useTheme();

  const [currId, setCurrId] = useState(0);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");
  const { addComment, addReply } = useCommentsStore();

  const [replyState, setReplyState] = useState({
    userId: "",
    commentId: "",
  });

  const ca = commentAction.bind(null, {
    commentId: replyState.commentId,
    postId: post.id,
    userId: data?.user.id,
  });

  const [formState, formAction] = useFormState(ca, initialState);

  useEffect(() => {
    if (commentTarget?.commentId) {
      setReplyState({
        commentId: commentTarget.commentId,
        userId: commentTarget.userId,
      });
    }
  }, [commentTarget?.commentId]);

  useEffect(() => {
    if (message === "") {
      setReplyState({
        commentId: "",
        userId: "",
      });
    }
  }, [message]);

  useEffect(() => {
    if (formState.type === "success") {
      const user = data?.user;
      if (!user) return;
      setMessage("");
      if (formState.content === "comment") {
        setNewCommentOnClient({
          authUser: user,
          comment: formState.data as TCommentSchema,
          setterFn: addComment,
        });
      }
      if (formState.content === "reply") {
        setNewReplyOnClient({
          authUser: user,
          reply: formState.data as TReplySchema,
          setterFn: addReply,
        });
      }
    }
    if (formState.type === "error") {
      toast.error(formState.message, { theme });
    }
  }, [currId]);

  return (
    <form
      ref={formRef}
      action={(data) => {
        setCurrId(new Date().getTime());
        formAction(data);
      }}
      className="flex h-full items-center pt-1"
    >
      <CommentInput message={message} setMessage={setMessage} />
    </form>
  );
};

export default CommentForm;
