"use client";

import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import { commentAction } from "./commentAction";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import ButtonSubmitComment from "./ButtonSubmitComment";
import { usePostStore } from "@/app/(auth)/PostStore";
import Link from "next/link";
import { TPost } from "@/fetchings/postsFetching";

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
  const [formState, formAction] = useFormState(commentAction, initialState);
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
    <section className="py-2">
      <Link href={`/post/${post.id}`}>
        <p className="text-skin-muted text-sm">
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
        className="border-b border-skin pb-2 flex gap-4"
      >
        <input defaultValue={post.id} name="postId" readOnly hidden />
        <input defaultValue={data?.user.id} name="userId" readOnly hidden />
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          name="message"
          type="text"
          className="placeholder:text-skin-muted focus:ring-0 px-0 w-full border-none text-sm bg-background flex-1"
          placeholder="Add a comment..."
        />
        {message.length > 0 && <ButtonSubmitComment />}
      </form>
    </section>
  );
};

export default CommentForm;
