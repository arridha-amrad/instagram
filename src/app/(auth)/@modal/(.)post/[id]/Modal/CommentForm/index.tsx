import { TComment, TPost } from "@/app/(auth)/postsFetching";
import { useEffect, useRef, useState } from "react";
import ButtonSubmitComment from "./ButtonSubmitComment";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useFormState } from "react-dom";
import { createCommentAction } from "@/actions/createCommentAction";
import { usePostStore } from "@/app/(auth)/PostStore";
import { toast } from "react-toastify";

type Props = {
  post: TPost;
};

const initialState = {
  message: "",
  type: "",
  errros: {} as any,
  data: {} as any,
};

const CommentForm = ({ post }: Props) => {
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

  useEffect(() => {
    if (formState.type === "success") {
      toast.success(formState.message, { theme });
      const newComment = formState.data;
      const user = data?.user;
      if (newComment && user) {
        addComment({
          ...newComment,
          sumComments: 0,
          owner: {
            id: user.id ?? "",
            email: user.email ?? "",
            name: user.name ?? "",
            username: user.username ?? "",
            avatar: user.image ?? null,
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
      className="flex items-center pt-1 h-full"
    >
      <input defaultValue={post.id} name="postId" readOnly hidden />
      <input defaultValue={data?.user.id} name="userId" readOnly hidden />
      <div className="flex-1">
        <input
          value={message}
          name="message"
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Add comment..."
          className="w-full text-sm h-12 flex-1 border-none bg-skin-input focus:ring-0 px-4"
        />
      </div>
      <ButtonSubmitComment message={message} />
    </form>
  );
};

export default CommentForm;
