import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useFormState } from "react-dom";
import { createCommentAction } from "@/actions/commentAction";
import { toast } from "react-toastify";
import { TCommentSchema, TPost, TReplySchema } from "@/fetchings/type";
import { useReplySetter } from "@/stores/ReplySetter";
import CommentInput from "./CommentInput";
import { useCommentsStore } from "@/stores/CommentsStore";

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
  const [formState, formAction] = useFormState(
    createCommentAction,
    initialState,
  );
  const [currId, setCurrId] = useState(0);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");
  const { addComment, addReply } = useCommentsStore();

  const [replyState, setReplyState] = useState({
    userId: "",
    commentId: "",
  });

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
      if (formState.content === "comment") {
        addComment({
          ...(formState.data as TCommentSchema),
          isLiked: false,
          sumRepliesRemaining: 0,
          sumLikes: 0,
          replies: [],
          sumReplies: 0,
          owner: {
            id: user.id ?? "",
            name: user.name ?? "",
            username: user.username ?? "",
            avatar: user.image ?? null,
          },
        });
      }
      if (formState.content === "reply") {
        addReply({
          ...(formState.data as TReplySchema),
          isLiked: false,
          sumLikes: 0,
          owner: {
            avatar: user.image ?? null,
            id: user.id ?? "",
            name: user.name ?? "",
            username: user.username ?? "",
          },
        });
      }
      setMessage("");
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
      <input
        readOnly
        type="text"
        value={replyState.commentId}
        name="commentId"
        hidden
      />
      <input
        readOnly
        type="text"
        value={replyState.userId}
        name="commentUserId"
        hidden
      />
      <input defaultValue={post.id} name="postId" readOnly hidden />
      <input defaultValue={data?.user.id} name="userId" readOnly hidden />
      <CommentInput message={message} setMessage={setMessage} />
    </form>
  );
};

export default CommentForm;
