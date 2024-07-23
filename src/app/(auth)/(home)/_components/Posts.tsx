"use client";

import { useLastElement } from "@/hooks/useLastElement";
import { useHomeStore } from "@/lib/zustand/stores/homeStore";
import { useEffect, useState } from "react";
import Post from "./Post";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { actionFetchPosts } from "@/lib/next-safe-action/actionFetchPosts";
import Spinner from "@/components/Spinner";

export default function Posts() {
  const { posts, page, total, addPosts } = useHomeStore();

  const [currPage, setCurrPage] = useState(page);
  const [loading, setLoading] = useState(false);

  const lastPostRef = useLastElement({
    callback: () => setCurrPage((val) => val + 1),
    data: posts,
    loading,
    total,
  });

  const { theme } = useTheme();

  useEffect(() => {
    if (page <= 0) return;
    const loadPosts = async () => {
      setLoading(true);
      try {
        const result = await actionFetchPosts({
          page: currPage,
        });
        if (result?.data) {
          addPosts(result.data.posts);
        }
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong", { theme });
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [currPage]);

  return (
    <section className="space-y-6">
      {posts.map((post, i) =>
        i === posts.length - 1 ? (
          <Post ref={lastPostRef} isFirst={i === 0} post={post} key={i} />
        ) : (
          <Post isFirst={i === 0} post={post} key={i} />
        ),
      )}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      )}
    </section>
  );
}
