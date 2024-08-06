"use client";

import Post from "@/components/Post/Post";
import usePostsStore from "@/stores/Posts";
import { useReplySetter } from "@/stores/ReplySetter";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = () => {
  const router = useRouter();
  const { reset } = useReplySetter();
  const { post } = usePostsStore();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("overflow-y-hidden", "pr-4");
    } else {
      document.documentElement.classList.remove("overflow-y-hidden", "pr-4");
    }
  }, [open]);

  const closeModal = () => {
    router.back();
    document.documentElement.classList.remove("overflow-y-hidden", "pr-4");
    reset();
  };

  return (
    open &&
    createPortal(
      <section className="fixed inset-0 flex items-center justify-center">
        <div
          onClick={closeModal}
          className="absolute inset-0 bg-background/50 backdrop-blur"
        />
        <div className="relative">
          {!post ? <p>Post not found</p> : <Post post={post} />}
        </div>
      </section>,
      document.body,
    )
  );
};

export default Modal;
