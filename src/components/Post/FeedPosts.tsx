"use client";

import Spinner from "@/components/Spinner";
import { useLastElement } from "@/hooks/useLastElement";
import { loadMoreFeedPosts } from "@/lib/actions/post";
import { useFeedPosts } from "@/stores/useFeedPosts";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FeedPost from "./FeedPost";

type Props = {
  sessionUserId: string;
};

export default function FeedPosts({ sessionUserId }: Props) {
  const { page, posts, total, date, addPosts } = useFeedPosts();

  const [currPage, setCurrPage] = useState(page);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname();

  const lastElementRef = useLastElement({
    callback: () => setCurrPage((val) => val + 1),
    data: posts,
    loading,
    total: total,
  });

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const result = await loadMoreFeedPosts.bind(
          null,
          pathname,
        )({
          page: currPage,
          date: new Date(date),
          total: total,
        });
        if (result?.data) {
          addPosts(result.data);
        }
      } catch (err) {
        toast.error("Something went wrong", { theme });
      } finally {
        setLoading(false);
      }
    };

    if (page === currPage) {
      return;
    } else {
      loadPosts();
    }
  }, [currPage]);

  const windowRowVirtualizer = useWindowVirtualizer({
    count: posts.length === total ? total : posts.length + 1,
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
        const post = posts[virtualRow.index];
        const isLoaderRow = virtualRow.index > posts.length - 1;
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
                <FeedPost sessionUserId={sessionUserId} post={post} />
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
