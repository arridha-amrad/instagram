"use client";

import PostExpanded from "@/components/PostExpanded";
import usePostsStore from "@/stores/Posts";
import { useReplySetter } from "@/stores/ReplySetter";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  currPathname: string;
};

const Modal = ({ currPathname }: Props) => {
  const router = useRouter();
  const { reset } = useReplySetter();
  const { post } = usePostsStore();
  const pathname = usePathname();

  useEffect(() => {
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
