"use client";

import Spinner from "@/components/Spinner";
import { useLastElement } from "@/hooks/useLastElement";
import { TInfiniteResult } from "@/lib/drizzle/queries/type";
import { actionFetchUserPosts } from "@/lib/next-safe-action/actionFetchUserPosts";
import usePostsStore from "@/stores/Posts";
import { useVirtualizer, useWindowVirtualizer } from "@tanstack/react-virtual";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import useMeasure from "react-use-measure";
import Post from "./UserPost";
import { TUserPost } from "@/lib/drizzle/queries/fetchUserPosts";

type Props = {
  initData: TInfiniteResult<TUserPost>;
};

const filterUniquePosts = (currPosts: TUserPost[]) => {
  const seenIds = new Set<string>();
  const posts = [] as TUserPost[];
  for (const post of currPosts) {
    if (!seenIds.has(post.id)) {
      posts.push(post);
      seenIds.add(post.id);
    }
  }
  return posts;
};

export default function UserPosts({ initData }: Props) {
  const [currPosts, setCurrPosts] = useState<TUserPost[]>(initData.data);
  // const { userPosts, totalUserPosts, pageUserPosts, addUserPosts } =
  //   usePostsStore();
  const [currPage, setCurrPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { theme } = useTheme();

  const posts = useMemo(() => {
    const createPostMatrix = (matrixLength: number) => {
      const result: TUserPost[][] = [];
      for (let i = 0; i < currPosts.length; i++) {
        const newArr: TUserPost[] = [];
        for (let j = 0; j < matrixLength; j++) {
          if (currPosts[i]) {
            newArr.push(currPosts[i]);
          }
          if (j === matrixLength - 1) {
            result.push(newArr);
          } else {
            i += 1;
          }
        }
      }
      return result;
    };
    const data = createPostMatrix(3);
    return data;
  }, [currPosts.length]);

  const parentRef = useRef<HTMLDivElement | null>(null);
  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const lastElementRef = useLastElement({
    callback: () => setCurrPage((val) => val + 1),
    data: currPosts,
    loading,
    total: initData.total,
  });

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const result = await actionFetchUserPosts({
          page: currPage,
          username: params.username as string,
          date: currPosts[currPosts.length - 1].createdAt,
          total: initData.total,
        });
        const incomingPosts = result?.data?.data;
        if (incomingPosts) {
          setCurrPosts((curr) => [
            ...filterUniquePosts([...curr, ...incomingPosts]),
          ]);
        }
      } catch (err) {
        toast.error("Something went wrong", { theme });
      } finally {
        setLoading(false);
      }
    };
    if (currPage === 1) {
      return;
    } else {
      loadPosts();
    }
  }, [currPage]);

  const rowVirtualizer = useWindowVirtualizer({
    count: currPosts.length < initData.total ? posts.length + 1 : posts.length,
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

  const [ref, { width: wdt1 }] = useMeasure();

  return (
    <div ref={parentRef}>
      <div
        ref={ref}
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
                  ref={lastElementRef}
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
