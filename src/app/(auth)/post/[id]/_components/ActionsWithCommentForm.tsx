"use client";

import ButtonComment from "@/components/Post/Post/ButtonComment";
import ButtonLikePost from "@/components/Post/Post/ButtonLike";
import React, { useRef } from "react";
import CommentForm from "./FormComment";
import { TPost } from "@/lib/drizzle/queries/type";

type Props = {
  post: TPost;
};

export default function ActionsWithCommentForm({ post }: Props) {
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const focusToCommentInput = () => {
    commentInputRef.current?.focus();
  };

  return (
    <>
      <section className="flex items-center gap-2 py-3">
        <ButtonLikePost isLiked={post.isLiked} postId={post.id} />
        <ButtonComment focusToCommentInput={focusToCommentInput} />
      </section>
      <section className="py-4">
        <CommentForm ref={commentInputRef} />
      </section>
    </>
  );
}
