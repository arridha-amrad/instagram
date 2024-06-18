"use client";

import PostExpanded from "@/components/PostExpanded";
import { TComment } from "@/fetchings/type";
import { useCommentsStore } from "@/stores/CommentsStore";
import { usePostStore } from "@/stores/PostStore";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  comments: TComment[];
  postId: string;
};

const Modal = ({ comments, postId }: Props) => {
  const router = useRouter();
  const { setComments } = useCommentsStore();
  const { posts } = usePostStore();
  const post = posts.find((p) => p.id === postId);

  useLayoutEffect(() => {
    setComments(comments);
    document.documentElement.classList.add("overflow-y-hidden", "pr-4");
  }, []);

  return createPortal(
    <section className="fixed inset-0 flex items-center justify-center">
      <div
        onClick={() => {
          router.back();
          document.documentElement.classList.remove(
            "overflow-y-hidden",
            "pr-4",
          );
        }}
        className="absolute inset-0 bg-background/50 backdrop-blur"
      />
      <div className="relative">
        {!post ? <p>Post not found</p> : <PostExpanded post={post} />}
      </div>
    </section>,
    document.body,
  );
};

export default Modal;
