"use client";

import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  postId: string;
};

const PostLink = ({ children, postId }: Props) => {
  return (
    <Link
      scroll={false}
      href={`/post/${postId}`}
      className="relative aspect-square overflow-hidden"
    >
      {children}
    </Link>
  );
};

export default PostLink;
