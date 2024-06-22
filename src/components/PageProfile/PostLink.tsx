"use client";

import { TPost } from "@/fetchings/type";
import { usePostDetailStore } from "@/lib/zustand/postDetailPage/usePostDetailState";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  post: TPost;
};

const PostLink = ({ children, post }: Props) => {
  const { setPost } = usePostDetailStore();
  return (
    <Link
      onClick={() => setPost(post)}
      scroll={false}
      href={`/post/${post.id}`}
      className="relative aspect-square overflow-hidden rounded-md"
    >
      {children}
    </Link>
  );
};

export default PostLink;
