"use client";

import PostExpanded from "@/components/PostExpanded";
import { TComment } from "@/fetchings/type";
import { useCommentsStore } from "@/stores/CommentsStore";
import { usePostStore } from "@/stores/PostStore";
import { useReplySetter } from "@/stores/ReplySetter";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  comments: TComment[];
};

const Modal = ({ comments }: Props) => {
  const router = useRouter();
  const { reset } = useReplySetter();
  const { post } = usePostStore();
  const { setComments } = useCommentsStore();

  useEffect(() => {
    setComments(comments);
    document.documentElement.classList.add("overflow-y-hidden", "pr-4");
  }, []);

  const closeModal = () => {
    router.back();
    document.documentElement.classList.remove("overflow-y-hidden", "pr-4");
    reset();
  };

  return createPortal(
    <section className="fixed inset-0 flex items-center justify-center">
      <div
        onClick={closeModal}
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
