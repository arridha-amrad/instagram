"use client";

import Spinner from "@/components/Spinner";
import { useLastElement } from "@/hooks/useLastElement";
import { TUserPost } from "@/lib/drizzle/queries/type";
import { actionFetchUserPosts } from "@/lib/next-safe-action/actionFetchUserPosts";
import usePostsStore from "@/stores/Posts";
import { useVirtualizer, useWindowVirtualizer } from "@tanstack/react-virtual";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import useMeasure from "react-use-measure";
import Post from "./UserPost";

export default function UserPosts() {
  const { userPosts, totalUserPosts, pageUserPosts, addUserPosts } =
    usePostsStore();
  const [currPage, setCurrPage] = useState(pageUserPosts);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { theme } = useTheme();

  const posts = useMemo(() => {
    const createPostMatrix = (matrixLength: number) => {
      const result: TUserPost[][] = [];
      for (let i = 0; i < userPosts.length; i++) {
        const newArr: TUserPost[] = [];
        for (let j = 0; j < matrixLength; j++) {
          if (userPosts[i]) {
            newArr.push(userPosts[i]);
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
  }, [userPosts.length]);

  const parentRef = useRef<HTMLDivElement | null>(null);
  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const lastElementRef = useLastElement({
    callback: () => setCurrPage((val) => val + 1),
    data: userPosts,
    loading,
    total: totalUserPosts,
  });

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const result = await actionFetchUserPosts({
          page: currPage,
          username: params.username as string,
        });
        if (result?.data) {
          addUserPosts(result.data.data);
        }
      } catch (err) {
        toast.error("Something went wrong", { theme });
      } finally {
        setLoading(false);
      }
    };
    if (pageUserPosts === currPage) {
      return;
    } else {
      loadPosts();
    }
  }, [currPage]);

  const rowVirtualizer = useWindowVirtualizer({
    count: userPosts.length < totalUserPosts ? posts.length + 1 : posts.length,
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
