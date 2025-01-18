import { TUserPost } from "@/lib/drizzle/queries/posts/fetchUserPosts";
import { actionFetchUserPosts } from "@/lib/next-safe-action/actionFetchUserPosts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useFetchUserPosts = (
  currPage: number,
  username: string,
  date: Date,
  total: number,
) => {
  const [isFetching, setIsFetching] = useState(false);
  const { theme } = useTheme();
  const [isFetchingDisabled, setIsFetchingDisabled] = useState(false);
  const [incomingPosts, setIncomingPosts] = useState<TUserPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      setIsFetching(true);
      try {
        const result = await actionFetchUserPosts({
          page: currPage,
          username,
          date,
          total,
        });
        const incomingPosts = result?.data?.data;
        if (incomingPosts) {
          setIncomingPosts(incomingPosts);
          if (incomingPosts.length < 6) {
            setIsFetchingDisabled(true);
          }
        } else {
          setIsFetchingDisabled(true);
        }
      } catch (err) {
        toast.error("Something went wrong", { theme });
      } finally {
        setIsFetching(false);
      }
    };
    if (currPage === 1) {
      return;
    } else {
      loadPosts();
    }
  }, [currPage]);

  return {
    isFetching,
    isFetchingDisabled,
    incomingPosts,
  };
};
