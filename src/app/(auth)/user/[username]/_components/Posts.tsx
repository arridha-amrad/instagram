"use client";

import usePostsStore from "@/stores/Posts";
import Post from "./Post";
import { useLastElement } from "@/hooks/useLastElement";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { actionFetchUserPosts } from "@/lib/next-safe-action/actionFetchUserPosts";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { useVirtualizer, useWindowVirtualizer } from "@tanstack/react-virtual";
import Spinner from "@/components/Spinner";
import useMeasure from "react-use-measure";
import mergeRefs from "merge-refs";

export default function Posts() {
  const { userPosts, totalUserPosts, pageUserPosts, addUserPosts } =
    usePostsStore();
  const [currPage, setCurrPage] = useState(pageUserPosts);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { theme } = useTheme();

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
    count: userPosts.length,
    estimateSize: () => 100,
    overscan: 5,
  });

  const colVirtualizer = useWindowVirtualizer({
    horizontal: true,
    count: 3,
    estimateSize: () => 100,
    overscan: 5,
  });

  const height = rowVirtualizer.getTotalSize();
  const width = colVirtualizer.getTotalSize();

  console.log({ height, width });

  return (
    <section
      style={{
        height: rowVirtualizer.getTotalSize(),
        width: "100%",
        position: "relative",
      }}
    >
      {rowVirtualizer.getVirtualItems().map((row) => (
        <div
          key={row.index}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `${row.size}px`,
            transform: `translateY(${row.start}px)`,
          }}
        >
          <div data-index={row.index} ref={rowVirtualizer.measureElement}>
            {colVirtualizer.getVirtualItems().map((col) => (
              <div
                key={col.key}
                className=""
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${col.size}px`,
                  height: `${col.size}px`,
                }}
              >
                <div data-index={col.index} ref={colVirtualizer.measureElement}>
                  <Post post={userPosts[row.index]} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* {rowVirtualizer.getVirtualItems().map((row) => {
        const post = userPosts[virtualRow.index];
        const isLoaderRow = virtualRow.index > userPosts.length / 3 - 1;
        return (
          <div
            key={virtualRow.index}
            data-index={virtualRow.index}
            ref={windowRowVirtualizer.measureElement}
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
              <Post post={post} />
            </div>
          </div>
        );
      })} */}
    </section>
  );

  // {isLoaderRow ? (
  //   <div
  //     ref={lastElementRef}
  //     className="flex items-center justify-center py-10"
  //   >
  //     <Spinner />
  //   </div>
  // ) : (
  //   <Post post={post} />
  // )}

  // return (
  //   <section className="grid w-full grid-cols-3 gap-1">
  //     {userPosts.map((post) => (
  //       <Post post={post} key={post.id} />
  //     ))}
  //   </section>
  // );
}
