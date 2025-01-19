"use client";

import Spinner from "@/components/Spinner";
import { createUserPostsMatrix } from "@/helpers/createPostMatrix";
import { filterUniqueUserPosts } from "@/helpers/filterUniquePosts";
import { TUserPost } from "@/lib/drizzle/queries/posts/fetchUserPosts";
import { TInfiniteResult } from "@/lib/drizzle/queries/type";
import { useVirtualizer, useWindowVirtualizer } from "@tanstack/react-virtual";
import { useParams, usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import useMeasure from "react-use-measure";
import Post from "./UserPost";
import { loadMoreUserPosts } from "@/lib/actions/post";

type Props = {
  initData: TInfiniteResult<TUserPost>;
};

export default function UserPosts({ initData }: Props) {
  const [currPosts, setCurrPosts] = useState<TUserPost[]>(initData.data);
  const [hasMore, setHasMore] = useState(initData.data.length === 6);
  const { ref, inView } = useInView();
  const params = useParams();
  const pathname = usePathname();

  const posts = useMemo(() => {
    const data = createUserPostsMatrix(3, currPosts);
    return data;
  }, [currPosts.length]);

  const parentRef = useRef<HTMLDivElement | null>(null);
  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const fetchMoreItems = useCallback(async () => {
    if (!hasMore) return;
    const args = {
      username: params.username as string,
      date: currPosts[currPosts.length - 1].createdAt,
      total: initData.total,
    };
    const result = await loadMoreUserPosts.bind(null, pathname)(args);
    const newPosts = result?.data?.data;
    if (newPosts) {
      if (newPosts.length < 6) {
        setHasMore(false);
      }
      setCurrPosts((prevPosts) =>
        filterUniqueUserPosts([...prevPosts, ...newPosts]),
      );
    } else {
      setHasMore(false);
    }
  }, [hasMore]);

  useEffect(() => {
    if (hasMore && inView) {
      fetchMoreItems();
    }
  }, [hasMore, inView]);

  const rowVirtualizer = useWindowVirtualizer({
    count: hasMore ? posts.length + 1 : posts.length,
    estimateSize: () => 100,
    overscan: 5,
    scrollMargin: parentOffsetRef.current,
  });

  const colVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    horizontal: true,
    count: 3,
    estimateSize: () => 100,
    overscan: 5,
  });

  const columnItems = colVirtualizer.getVirtualItems();

  const [before, after] =
    columnItems.length > 0
      ? [
          columnItems[0].start,
          colVirtualizer.getTotalSize() -
            columnItems[columnItems.length - 1].end,
        ]
      : [0, 0];

  const [refM, { width: wdt1 }] = useMeasure();

  return (
    <div ref={parentRef}>
      <div
        ref={refM}
        style={{
          height: rowVirtualizer.getTotalSize(),
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((row) => {
          const isLoaderRow = row.index > posts.length - 1;
          return (
            <div
              key={row.key}
              data-index={row.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translateY(${
                  row.start - rowVirtualizer.options.scrollMargin
                }px)`,
                display: "flex",
              }}
            >
              {isLoaderRow ? (
                <div
                  ref={ref}
                  className="flex items-center justify-center py-10"
                >
                  <Spinner />
                </div>
              ) : (
                <>
                  <div style={{ width: `${before}px` }} />
                  {columnItems.map((column) => {
                    const post = posts[row.index][column.index];
                    if (!post) return null;
                    return (
                      <div
                        key={column.key}
                        style={{
                          width: wdt1 / 3,
                          aspectRatio: 1 / 1,
                          padding: "0.25rem",
                        }}
                      >
                        <Post isFirstPost={row.index === 0} post={post} />
                      </div>
                    );
                  })}
                  <div style={{ width: `${after}px` }} />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
