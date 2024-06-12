import { useEffect, useRef, useState } from "react";
import ButtonSubmitComment from "./ButtonSubmitComment";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useFormState } from "react-dom";
import { createCommentAction } from "@/actions/createCommentAction";
import { toast } from "react-toastify";
import { TPost } from "@/fetchings/type";
import { usePostStore } from "@/stores/PostStore";
import { useReplySetter } from "@/stores/ReplySetter";
import CommentInput from "./CommentInput";

type Props = {
  post: TPost;
};

const initialState = {
  message: "",
  type: "",
  content: "",
  errros: {} as any,
  data: {} as any,
};

const CommentForm = ({ post }: Props) => {
  const { commentTarget } = useReplySetter();
  const { data } = useSession();
  const { theme } = useTheme();
  const [formState, formAction] = useFormState(
    createCommentAction,
    initialState
  );
  const [currId, setCurrId] = useState(0);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");
  const { addComment } = usePostStore();

  const [replyState, setReplyState] = useState({
    userId: "",
    commentId: "",
  });

  useEffect(() => {
    if (commentTarget) {
      setMessage(`@${commentTarget.username}`);
      setReplyState({
        commentId: commentTarget.commentId,
        userId: commentTarget.userId,
      });
    }
  }, [commentTarget]);

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
      toast.success(formState.message, { theme });
      const actionResult = formState.data;
      const user = data?.user;
      // if (actionResult && user) {
      //   if (formState.content === "comment") {
      //     addComment({
      //       ...actionResult,
      //       isLiked: false,
      //       sumLikes: 0,
      //       owner: {
      //         id: user.id ?? "",
      //         name: user.name ?? "",
      //         username: user.username ?? "",
      //         avatar: user.image ?? null,
      //       },
      //     });
      //   }
      // }
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
      className="flex items-center pt-1 h-full"
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
