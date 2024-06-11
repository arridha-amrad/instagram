"use client";

import { useEffect } from "react";
import { usePostStore } from "./PostStore";

import PostCard from "./components/Post/PostCard";
import MySpinner from "@/components/Spinner";
import { TPost } from "@/fetchings/type";

type Props = {
  posts: TPost[];
};

export default function Posts({ posts }: Props) {
  const { setPosts, posts: ps, isLoadPosts } = usePostStore();

  useEffect(() => {
    setPosts(posts);
  }, []);

  if (isLoadPosts) {
    return (
      <div className="py-10">
        <MySpinner />
      </div>
    );
  }

  return ps.map((post) => <PostCard post={post} key={post.id} />);
}
