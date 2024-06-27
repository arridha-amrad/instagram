"use client";

import { commentAction } from "@/actions/commentAction";
import { TCommentSchema, TPost } from "@/fetchings/type";
import setNewCommentOnClient from "@/helpers/setNewCommentOnClient";
import { usePostStore } from "@/stores/PostStore";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import ButtonSubmitComment from "./ButtonSubmitComment";

const initialState = {
  message: "",
  type: "",
  errors: {} as any,
  data: {} as any,
};

type Props = {
  post: TPost;
};

const CommentForm = ({ post }: Props) => {
  const { data } = useSession();
  const { theme } = useTheme();
  const ca = commentAction.bind(null, {
    userId: data?.user.id,
    postId: post.id,
  });
  const [formState, formAction] = useFormState(ca, initialState);
  const [currId, setCurrId] = useState(0);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");
  const { addComment } = usePostStore();

  useEffect(() => {
    if (formState.type === "success") {
      setMessage("");
      formRef.current?.reset();
      const newComment = formState.data as TCommentSchema;
      const user = data?.user;
      if (newComment && user) {
        setNewCommentOnClient({
          authUser: user,
          comment: newComment,
          setterFn: addComment,
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
      className="flex gap-4 border-b border-skin pb-2"
    >
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        name="message"
        type="text"
        className="w-full flex-1 border-none bg-background px-0 text-sm placeholder:text-skin-muted focus:ring-0"
        placeholder="Add a comment..."
      />
      {message.length > 0 && <ButtonSubmitComment />}
    </form>
  );
};

export default CommentForm;
