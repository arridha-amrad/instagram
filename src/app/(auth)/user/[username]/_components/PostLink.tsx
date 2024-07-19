"use client";

import { TPost } from "@/fetchings/type";
import { usePostStore } from "@/stores/PostStore";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  post: TPost;
};

const PostLink = ({ children, post }: Props) => {
  const { setPost } = usePostStore();
  return (
    <Link
      onClick={() => setPost(post)}
      scroll={false}
      href={`/post/${post.id}`}
      className="relative aspect-square overflow-hidden"
    >
      {children}
    </Link>
  );
};

export default PostLink;
