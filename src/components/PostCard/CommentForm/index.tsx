"use client";

import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import ButtonSubmitComment from "./ButtonSubmitComment";
import Link from "next/link";
import { TCommentSchema, TPost } from "@/fetchings/type";
import { usePostStore } from "@/stores/PostStore";
import { commentAction } from "@/actions/commentAction";
import useAddComment from "@/helpers/useAddComment";
import setNewCommentOnClient from "@/helpers/useAddComment";

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
    <section className="py-2">
      <Link scroll={false} href={`/post/${post.id}`}>
        <p className="text-sm text-skin-muted">
          {post.sumComments}&nbsp;{" "}
          {post.sumComments > 1 ? "comments" : "comment"}
        </p>
      </Link>

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
    </section>
  );
};

export default CommentForm;
