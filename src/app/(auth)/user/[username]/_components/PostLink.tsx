"use client";

import { TPost } from "@/fetchings/type";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  post: TPost;
};

const PostLink = ({ children, post }: Props) => {
  return (
    <Link
      scroll={false}
      href={`/post/${post.id}`}
      className="relative aspect-square overflow-hidden"
    >
      {children}
    </Link>
  );
};

export default PostLink;
