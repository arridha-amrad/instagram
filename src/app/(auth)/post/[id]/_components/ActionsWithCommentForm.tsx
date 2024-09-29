"use client";

import ButtonComment from "@/components/Post/Post/ButtonComment";
import ButtonLikePost from "@/components/Post/Post/ButtonLike";
import React, { useRef, useState } from "react";
import CommentForm from "./FormComment";
import { TPost } from "@/lib/drizzle/queries/fetchPost";

type Props = {
  post: TPost;
};

export default function ActionsWithCommentForm({ post }: Props) {
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const [likes, setLikes] = useState(post.sumLikes);
  const [isLiked, setIsLiked] = useState(post.isLiked);

  const focusToCommentInput = () => {
    commentInputRef.current?.focus();
  };
  const callback = () => {
    setIsLiked((val) => !val);
    setLikes((val) => (isLiked ? (val -= 1) : (val += 1)));
  };

  return (
    <>
      <section className="flex items-center gap-2 py-3">
        <ButtonLikePost
          callback={callback}
          isLiked={isLiked}
          postId={post.id}
        />
        <ButtonComment focusToCommentInput={focusToCommentInput} />
      </section>
      <section className="">
        <h1 className="font-semibold">{likes} Likes</h1>
      </section>
      <section className="py-4">
        <CommentForm ref={commentInputRef} />
      </section>
    </>
  );
}
