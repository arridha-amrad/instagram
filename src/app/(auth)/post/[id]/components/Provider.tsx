"use client";

import MySpinner from "@/components/Spinner";
import { TComment, TPost } from "@/fetchings/type";
import { useCommentsStore } from "@/stores/CommentsStore";
import { usePostStore } from "@/stores/PostStore";
import { useReplySetter } from "@/stores/ReplySetter";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  post: TPost;
  comments: TComment[];
};

export default function Provider({ children, post, comments }: Props) {
  const { setPost, post: pst } = usePostStore();
  const { setComments } = useCommentsStore();
  const { reset } = useReplySetter();

  const pathname = usePathname();

  useEffect(() => {
    reset();
  }, [pathname]);

  useEffect(() => {
    setPost(post);
    setComments(comments);
  }, [post, comments]);

  if (!pst) {
    return (
      <div className="flex justify-start px-4 py-4">
        <MySpinner />
      </div>
    );
  }

  return children;
}
