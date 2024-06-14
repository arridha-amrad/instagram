"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TComment } from "@/fetchings/type";
import { usePostStore } from "@/stores/PostStore";
import { useCommentsStore } from "@/stores/CommentsStore";
import { useReplySetter } from "@/stores/ReplySetter";
import Wrapper from "./Wrapper";
import PostExpanded from "@/components/PostExpanded";

type Props = {
  id: string;
  comments: TComment[];
};

const ModalPostExpanded = ({ id, comments }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { posts } = usePostStore();
  const { setComments } = useCommentsStore();
  const { reset } = useReplySetter();
  const post = posts.find((p) => p.id === id);

  if (!post) return null;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setComments(comments);
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
    setOpen(false);
    reset();
  };

  if (pathname !== `/post/${id}`) {
    return null;
  }

  return (
    <Wrapper closeModal={closeModal}>
      <div className="relative flex">
        <PostExpanded post={post} />
      </div>
    </Wrapper>
  );
};

export default ModalPostExpanded;
