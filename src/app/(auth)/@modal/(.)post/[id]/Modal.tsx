"use client";

import CarouselOne from "@/components/Post/Carousel/CarouselOne";
import Post from "@/components/Post/Post";
import usePostsStore from "@/stores/Posts";
import { useReplySetter } from "@/stores/ReplySetter";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = () => {
  const router = useRouter();
  const { setReply } = useReplySetter();
  const { post } = usePostsStore();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!pathname.startsWith("/post")) {
      setOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("overflow-y-hidden", "pr-4");
    } else {
      document.documentElement.classList.remove("overflow-y-hidden", "pr-4");
    }
  }, [open]);

  const closeModal = () => {
    router.back();
    setOpen(false);
    setReply(null);
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
          {!post ? (
            <p>Post not found</p>
          ) : (
            <Post post={post}>
              <CarouselOne urls={post.urls.map((u) => u.url)} />
            </Post>
          )}
        </div>
      </section>,
      document.body,
    )
  );
};

export default Modal;
