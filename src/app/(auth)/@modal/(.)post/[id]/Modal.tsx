"use client";

import PostExpanded from "@/components/PostExpanded";
import { TFetchComments } from "@/fetchings/type";
import { usePostPageStore } from "@/lib/zustand/stores/postPageStore";
import { useCommentsStore } from "@/stores/CommentsStore";
import { useReplySetter } from "@/stores/ReplySetter";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  comments: TFetchComments;
  currPathname: string;
};

const Modal = ({ comments, currPathname }: Props) => {
  const router = useRouter();
  const { reset } = useReplySetter();
  const { setComments } = useCommentsStore();
  const { post } = usePostPageStore();
  const pathname = usePathname();

  useEffect(() => {
    setComments(comments.comments, comments.total);
    document.documentElement.classList.add("overflow-y-hidden", "pr-4");
  }, []);

  const closeModal = () => {
    router.back();
    document.documentElement.classList.remove("overflow-y-hidden", "pr-4");
    reset();
  };

  if (pathname !== currPathname) {
    document.documentElement.classList.remove("overflow-y-hidden", "pr-4");
    return null;
  }

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
