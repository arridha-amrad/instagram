"use client";

import Spinner from "@/components/Spinner";
import { useLastElement } from "@/hooks/useLastElement";
import { actionFetchPosts } from "@/lib/next-safe-action/actionFetchPosts";
import usePostsStore from "@/stores/Posts";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Post from "./Post";

export default function Posts() {
  const { feedPosts, pageFeedPosts, totalFeedPosts, addFeedPosts } =
    usePostsStore();

  const [currPage, setCurrPage] = useState(pageFeedPosts);
  const [loading, setLoading] = useState(false);

  const lastElementRef = useLastElement({
    callback: () => setCurrPage((val) => val + 1),
    data: feedPosts,
    loading,
    total: totalFeedPosts,
  });

  const { theme } = useTheme();

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const result = await actionFetchPosts({
          page: currPage,
        });
        if (result?.data) {
          addFeedPosts(result.data.posts);
        }
      } catch (err) {
        toast.error("Something went wrong", { theme });
      } finally {
        setLoading(false);
      }
    };

    if (pageFeedPosts === currPage) {
      return;
    } else {
      loadPosts();
    }
  }, [currPage]);

  const windowRowVirtualizer = useWindowVirtualizer({
    count:
      feedPosts.length === totalFeedPosts
        ? totalFeedPosts
        : feedPosts.length + 1,
    estimateSize: () => 50,
    overscan: 5,
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
        const post = feedPosts[virtualRow.index];
        const isLoaderRow = virtualRow.index > feedPosts.length - 1;
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
              {isLoaderRow ? (
                <div
                  ref={lastElementRef}
                  className="flex items-center justify-center py-10"
                >
                  <Spinner />
                </div>
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
