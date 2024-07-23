"use client";

import { useLastElement } from "@/hooks/useLastElement";
import { useHomeStore } from "@/lib/zustand/stores/homeStore";
import { useEffect, useState } from "react";
import Post from "./Post";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { actionFetchPosts } from "@/lib/next-safe-action/actionFetchPosts";
import Spinner from "@/components/Spinner";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

export default function Posts() {
  const { posts, page, total, addPosts, isLoading } = useHomeStore();

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
    if (page <= 0 || isLoading) return;
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

  const windowRowVirtualizer = useWindowVirtualizer({
    count: posts.length,
    estimateSize: () => 50,
    overscan: 5,
    getItemKey(index) {
      return posts[index].id;
    },
  });

  return (
    <section
      style={{
        height: windowRowVirtualizer.getTotalSize(),
        width: "100%",
        position: "relative",
      }}
    >
      {windowRowVirtualizer.getVirtualItems().map((virtualRow) => {
        const post = posts[virtualRow.index];
        return (
          <div
            key={virtualRow.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <div
              data-index={virtualRow.index}
              ref={windowRowVirtualizer.measureElement}
            >
              {virtualRow.index === posts.length - 1 ? (
                <>
                  <Post
                    ref={lastPostRef}
                    isFirst={virtualRow.index === 0}
                    post={post}
                  />
                  {loading && (
                    <div className="flex items-center justify-center py-10">
                      <Spinner />
                    </div>
                  )}
                </>
              ) : (
                <Post isFirst={virtualRow.index === 0} post={post} />
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
