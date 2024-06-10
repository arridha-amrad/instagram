"use client";

import { useEffect } from "react";
import { usePostStore } from "./PostStore";
import { TPost } from "../../fetchings/postsFetching";
import PostCard from "./components/Post/PostCard";
import MySpinner from "@/components/Spinner";

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
